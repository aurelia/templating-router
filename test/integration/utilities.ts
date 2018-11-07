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

/**
 * Easily create an element without heavy typing, using hyperscript signature
 */
export function h<T extends keyof HTMLElementTagNameMap>(
  name: T,
  attrs: { [attr: string]: any } = {},
  ...children: (string | number | boolean | null | undefined | Node)[]
) {
  let el = document.createElement<T>(name);
  for (let attr in attrs) {
    if (attr === 'class' || attr === 'className' || attr === 'cls') {
      let value: string[] = attrs[attr];
      value = value === undefined || value === null ? [] : Array.isArray(value) ? value : ('' + value).split(' ');
      el.classList.add(...value.filter(Boolean));
    } else if (attr in el || attr === 'data' || attr[0] === '_') {
      el[attr] = attrs[attr];
    } else {
      el.setAttribute(attr, attrs[attr]);
    }
  }
  let childrenCt = el.tagName === 'TEMPLATE' ? (el as HTMLTemplateElement).content : el;
  for (let child of children) {
    if (child === null || child === undefined) {
      continue;
    }
    childrenCt.appendChild(child instanceof Node ? child : document.createTextNode('' + child));
  }
  return el;
}
