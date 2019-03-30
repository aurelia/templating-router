import { IStaticResourceConfig } from 'aurelia-templating';
import { Router } from 'aurelia-router';
import { DOM } from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('route-href');

/**
 * Helper custom attribute to help associate an element with a route by name
 */
export class RouteHref {

  /*@internal */
  static inject() {
    return [Router, DOM.Element];
  }

  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   */
  static $resource: IStaticResourceConfig = {
    type: 'attribute',
    name: 'route-href',
    bindables: [
      { name: 'route', changeHandler: 'processChange', primaryProperty: true },
      { name: 'params', changeHandler: 'processChange' },
      'attribute'
    ] as any // type definition of Aurelia templating is wrong
  };

  /**
   * Current router of this attribute
   */
  readonly router: Router;

  /**
   * Element this attribute is associated with
   */
  readonly element: Element;

  /**@internal */
  isActive: boolean;

  /**
   * Name of the route this attribute refers to. This name should exist in the current router hierarchy
   */
  route: string;

  /**
   * Parameters of this attribute to generate URL.
   */
  params: Record<string, any>;

  /**
   * Target property on a custom element if this attribute is put on a custom element
   * OR an attribute if this attribute is put on a normal element
   */
  attribute: string;

  constructor(
    router: Router,
    element: Element
  ) {
    this.router = router;
    this.element = element;
    this.attribute = 'href';
  }

  bind() {
    this.isActive = true;
    this.processChange();
  }

  unbind() {
    this.isActive = false;
  }

  attributeChanged(value: any, previous: any) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    return this.processChange();
  }

  processChange() {
    return this.router
      .ensureConfigured()
      .then((): null => {
        if (!this.isActive) {
          // returning null to avoid Bluebird warning
          return null;
        }
        const element = this.element as Element & { au: any };

        const href = this.router.generate(this.route, this.params);

        if (element.au.controller) {
          element.au.controller.viewModel[this.attribute] = href;
        } else {
          element.setAttribute(this.attribute, href);
        }

        // returning null to avoid Bluebird warning
        return null;
      })
      .catch((reason: any) => {
        logger.error(reason);
      });
  }
}

