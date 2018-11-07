import { ConfiguresRouter, Router } from 'aurelia-router';

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
