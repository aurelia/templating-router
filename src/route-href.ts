import { customAttribute, bindable } from 'aurelia-templating';
import { Router } from 'aurelia-router';
import { DOM } from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';
import { IAureliaElement } from './interfaces';

const logger = LogManager.getLogger('route-href');

export class RouteHref {

  static inject() {
    return [Router, DOM.Element];
  }

  router: Router;

  element: IAureliaElement;

  isActive: boolean;

  route: string;

  params: Record<string, any>;

  attribute: string;

  constructor(
    router: Router,
    element: Element
  ) {
    this.router = router;
    this.element = element;
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

    this.processChange();
  }

  processChange() {
    return this.router
      .ensureConfigured()
      .then(() => {
        if (!this.isActive) {
          return null;
        }

        let href = this.router.generate(this.route, this.params);

        if (this.element.au.controller) {
          this.element.au.controller.viewModel[this.attribute] = href;
        } else {
          this.element.setAttribute(this.attribute, href);
        }

        return null;
      })
      .catch(reason => {
        logger.error(reason);
      });
  }
}

// Doing this to miniize the amount of code generated
customAttribute('route-href')(RouteHref);
bindable({ name: 'route', changeHandler: 'processChange', primaryProperty: true })(RouteHref);
bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref);
bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref);
