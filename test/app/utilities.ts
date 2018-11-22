import { ConfiguresRouter, Router, AppRouter, RouterConfiguration } from 'aurelia-router';
import { Aurelia, Controller } from 'aurelia-framework';
import { bootstrap } from 'aurelia-bootstrapper';
import { IConstructable } from 'integration/interfaces';

export * from '../integration/utilities';
export * from '../integration/shared';
export * from '../integration/interfaces';

import { wait } from '../integration/utilities';

export interface ITestRoutingComponent extends ConfiguresRouter {
  readonly element: Element;
  router: Router;
}

/**
 * Verify at number of element matching the selector inside component tester element matches count (default: 1)
 */
export function verifyElementsCount(element: Element, selectorCountPair: [string, number][], message?: string): boolean;
export function verifyElementsCount(element: Element, selector: string, count?: number): boolean;
export function verifyElementsCount(element: Element, selectorOrSelectorCountPair: string | [string, number][], countOrMessage?: number | string): boolean {
  if (typeof selectorOrSelectorCountPair === 'string') {
    const elCount = element.querySelectorAll(selectorOrSelectorCountPair).length;
    return expect(elCount).toBe(
      countOrMessage as number,
      `Expected ${countOrMessage as number} elements with selector "${selectorOrSelectorCountPair}". Actual: ${elCount}.`
    );
  } else {
    return selectorOrSelectorCountPair
      .map(([selector, count]) => {
        const elCount = element.querySelectorAll(selector).length;
        return expect(elCount).toBe(
          count,
          `Expected ${count} elements with selector "${selector}". Actual: ${elCount}.${countOrMessage ? `Failure message:\n${countOrMessage}` : ''}`
        );
      })
      .every(Boolean);
  }
}

export const IRouteConfigs = 'IRouteConfig';
export const ILifeCyclesCallbacks = 'ILifeCycles';
export interface ILifeCyclesAssertions<T = any> {
  construct?(viewModel: T): any;
  canActivate?(viewModel: T): any;
  activate?(viewModel: T): any;
  configureRouter?(viewModel: T): any;
  created?(viewModel: T): any;
  bind?(viewModel: T): void;
  attached?(viewModel: T): void;
  canDeactivate?(viewModel: T): any;
  deactivate?(viewModel: T): any;
  detached?(viewModel: T): void;
  unbind?(viewModel: T): void;
}

export function invokeAssertions(obj: { lifecycleCallbacks?: ILifeCyclesAssertions }, method: keyof ILifeCyclesAssertions, ...args: any[]) {
  if (obj.lifecycleCallbacks && obj.lifecycleCallbacks[method]) {
    obj.lifecycleCallbacks[method].call(null, obj, ...args);
  }
}

export interface IEntryConfigure<T> {
  aurelia: Aurelia;
  viewModel: T;
  (aurelia: Aurelia): Promise<any>;
}

/**
 * Create an entry `configure` function, similar to `export function configure` in `main.js` of a normal Aurelia application
 * This takes a few parameter to make the bootstrapping process more suitable for testing
 */
export function createEntryConfigure<T = ITestRoutingComponent>(
  root: string | IConstructable<ITestRoutingComponent>,
  host: Element,
  registrations: [any, any][],
  onBootstrapped: (aurelia: Aurelia, viewModel: T) => any = () => Promise.resolve(),
  onBootstrappedFailed: <TFailure = Error>(ex: TFailure, aurelia: Aurelia) => any = () => Promise.resolve(),
  autoCleanUp = true
): IEntryConfigure<T> {
  const entryConfigure = async function($aurelia: Aurelia) {
    try {
      entryConfigure.aurelia = $aurelia;
      $aurelia.use.standardConfiguration();
      for (const [key, value] of registrations) {
        $aurelia.container.autoRegister(key, value);
      }
      await $aurelia.start();
      await $aurelia.setRoot(root, host);

      entryConfigure.viewModel = ($aurelia as any).root.viewModel;

      await Promise.resolve(onBootstrapped($aurelia, entryConfigure.viewModel));
      if (autoCleanUp) {
        cleanUp($aurelia);
      }
    } catch (ex) {
      cleanUp($aurelia);
      console.log('Bootstrapping error:\n======================================');
      console.error(ex);
      await Promise.resolve(onBootstrappedFailed(ex, $aurelia));
      throw ex;
    }
  } as IEntryConfigure<T>;
  return entryConfigure;
}

/**
 * Clean up all potential global handlers / states that can mess up subsequent test suites
 */
export function cleanUp(aurelia: Aurelia) {
  if (!aurelia) {
    return;
  }
  try {
    const appRouter = aurelia.container.get(Router) as AppRouter;
    appRouter.deactivate();
    appRouter.reset();
    const root = (aurelia as any).root as Controller;
    if (root) {
      root.unbind();
      root.detached();
    }
    aurelia.host.remove();
  } catch (ex) {
    console.warn('Unable to deactivate app router. Expect tests to have buggy behavior due to multiple app routers.');
  }
}

let bootstrapCount = 0;
/**
 * Allow a timeframe for bootstrapping process to response, with a guard to fail and invoke onTimeout callback
 * when a bootstrap failed to complete
 */
export function bootstrapAppWithTimeout(
  configure: (aurelia: Aurelia) => Promise<any>,
  onBootstrapTimeout: (reason?: any) => any = () => { },
  timeoutPeriod = 3000
): Promise<Aurelia> {
  let timeoutED = false;
  let $aurelia: Aurelia;
  bootstrapCount++;
  return Promise
    .race([
      wait(timeoutPeriod).then(() => {
        timeoutED = true;
        return onBootstrapTimeout();
      }),
      bootstrap((aurelia) => {
        $aurelia = aurelia;
        return configure(aurelia);
      })
    ])
    .then(
      (result) => {
        if (timeoutED) {
          console.log(`Resolved: [${bootstrapCount}] -----BOOTSTRAPPING ___ TIMEOUT'D-----`);
          cleanUp($aurelia);
        }
        return $aurelia;
      },
      (ex) => {
        if (timeoutED) {
          console.log(`Rejected: [${bootstrapCount}] -----BOOTSTRAPPING ___ TIMEOUT'D-----`);
          cleanUp($aurelia);
        }
        throw ex;
      }
    );
}

export function getNormalizedHash() {
  return location.hash.replace(/^#?\/?/, '#/');
}
