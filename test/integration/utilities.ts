import { ComponentTester } from 'aurelia-testing';

/**
 * Verify at number of element matching the selector inside component tester element matches count (default: 1)
 */
export function verifyElementsCount(component: ComponentTester, selectorCountPair: [string, number][]): boolean;
export function verifyElementsCount(component: ComponentTester, selector: string, count?: number): boolean;
export function verifyElementsCount(component: ComponentTester, selectorOrSelectorCountPair: string | [string, number][], count?: number): boolean {
  if (typeof selectorOrSelectorCountPair === 'string') {
    const elCount = component.element.querySelectorAll(selectorOrSelectorCountPair).length;
    return expect(elCount).toBe(
      count,
      `Expected ${count} elements with selector "${selectorOrSelectorCountPair}". Actual: ${elCount}.`
    );
  } else {
    return selectorOrSelectorCountPair
      .map(([selector, count]) => {
        const elCount = component.element.querySelectorAll(selector).length;
        return expect(elCount).toBe(
          count,
          `Expected ${count} elements with selector "${selector}". Actual: ${elCount}.`
        );
      })
      .every(Boolean);
  }
}

/**
 * Wait for short period of time, default: 100ms
 */
export function wait(time: any = 100) {
  return new Promise<void>(res => setTimeout(() => res(), typeof time === 'number' ? time : 250));
}
