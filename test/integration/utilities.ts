import { ComponentTester } from 'aurelia-testing';

/**
 * Verify at number of element matching the selector inside component tester element matches count (default: 1)
 */
export function verifyElementsCount(component: ComponentTester, selector: string, count: number = 1): boolean {
  const elCount = component.element.querySelectorAll(selector).length;
  return expect(elCount).toBe(
    count,
    `Expected ${count} elements. Actually: ${elCount}.`
  );
}

export function wait(time: any = 250) {
  return new Promise<void>(res => setTimeout(() => res(), typeof time === 'number' ? time : 250));
}
