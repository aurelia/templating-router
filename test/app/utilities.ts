import { ConfiguresRouter, Router, AppRouter } from 'aurelia-router';
import { Aurelia, Controller } from 'aurelia-framework';
import { bootstrap } from 'aurelia-bootstrapper';
import { IConstructable } from 'integration/interfaces';

export * from '../integration/utilities';
export * from '../integration/shared';
export * from '../integration/interfaces';

export interface ITestRoutingComponent extends ConfiguresRouter {
  readonly element: Element;
  router: Router;
}

/**
 * Verify at number of element matching the selector inside component tester element matches count (default: 1)
 */
export function verifyElementsCount(element: Element, selectorCountPair: [string, number][]): boolean;
export function verifyElementsCount(element: Element, selector: string, count?: number): boolean;
export function verifyElementsCount(element: Element, selectorOrSelectorCountPair: string | [string, number][], count?: number): boolean {
  if (typeof selectorOrSelectorCountPair === 'string') {
    const elCount = element.querySelectorAll(selectorOrSelectorCountPair).length;
    return expect(elCount).toBe(
      count,
      `Expected ${count} elements with selector "${selectorOrSelectorCountPair}". Actual: ${elCount}.`
    );
  } else {
    return selectorOrSelectorCountPair
      .map(([selector, count]) => {
        const elCount = element.querySelectorAll(selector).length;
        return expect(elCount).toBe(
          count,
          `Expected ${count} elements with selector "${selector}". Actual: ${elCount}.`
        );
      })
      .every(Boolean);
  }
}

export const IRouteConfigs = 'IRouteConfig';
export const ILifeCyclesCallbacks = 'ILifeCycles';
export interface ILifeCyclesAssertions<T = any> {
  construct?(viewModel: T): void;
  canActivate?(viewModel: T): void;
  activate?(viewModel: T): void;
  configureRouter?(viewModel: T): void;
  created?(viewModel: T): void;
  bind?(viewModel: T): void;
  attached?(viewModel: T): void;
  canDeactivate?(viewModel: T): void;
  deactivate?(viewModel: T): void;
  detached?(viewModel: T): void;
  unbind?(viewModel: T): void;
}

export function invokeAssertions(obj: { lifecycleCallbacks?: ILifeCyclesAssertions }, method: keyof ILifeCyclesAssertions) {
  if (obj.lifecycleCallbacks && obj.lifecycleCallbacks[method]) {
    obj.lifecycleCallbacks[method].call(null, obj);
  }
}

export interface IEntryConfigure<T> {
  aurelia: Aurelia;
  viewModel: T;
  (aurelia: Aurelia): Promise<any>;
}

export function createEntryConfigure<T = ITestRoutingComponent>(
  root: string | IConstructable<ITestRoutingComponent>,
  host: Element,
  registrations: [any, any][],
  onBootstrapped: (aurelia: Aurelia, viewModel: T) => any = () => Promise.resolve(),
  autoCleanUp = true
): IEntryConfigure<T> {
  const entryConfigure = async function($aurelia: Aurelia) {
    try {
      entryConfigure.aurelia = $aurelia;
      $aurelia.use.standardConfiguration();
      for (const [key, value] of registrations) {
        // register as either instance / singleton
        // by default instance for everything except function
        // if a function has custom registration, then it will be resolved based on that
        $aurelia.container.autoRegister(key, value);
      }
      await $aurelia.start();
      await $aurelia.setRoot(root, host);

      entryConfigure.viewModel = ($aurelia as any).root.viewModel;

      await Promise.resolve(onBootstrapped($aurelia, entryConfigure.viewModel));
      if (autoCleanUp) {
        await Promise.resolve(cleanUp($aurelia));
      }
    } catch (ex) {
      try {
        const appRouter = $aurelia.container.get(Router) as AppRouter;
        appRouter.deactivate();
        appRouter.reset();
      } catch (ex2) {
        console.warn('Unable to deactivate app router. Expect tests to have buggy behavior due to multiple app routers.');
      }
      throw ex;
    }
  } as IEntryConfigure<T>;
  return entryConfigure;
}

export function cleanUp(aurelia: Aurelia) {
  const appRouter = aurelia.container.get(Router) as AppRouter;
  appRouter.deactivate();
  appRouter.reset();
  const root = (aurelia as any).root as Controller;
  root.unbind();
  root.detached();
  aurelia.host.remove();
}
