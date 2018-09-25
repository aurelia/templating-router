var _dec, _dec2, _dec3, _dec4, _class;

import { customAttribute, bindable } from 'aurelia-templating';
import { Router } from 'aurelia-router';
import { DOM } from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('route-href');

export let RouteHref = (_dec = customAttribute('route-href'), _dec2 = bindable({ name: 'route', changeHandler: 'processChange', primaryProperty: true }), _dec3 = bindable({ name: 'params', changeHandler: 'processChange' }), _dec4 = bindable({ name: 'attribute', defaultValue: 'href' }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class RouteHref {

  static inject() {
    return [Router, DOM.Element];
  }

  constructor(router, element) {
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

  attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  }

  processChange() {
    return this.router.ensureConfigured().then(() => {
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
    }).catch(reason => {
      logger.error(reason);
    });
  }
}) || _class) || _class) || _class) || _class);