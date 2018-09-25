import {customAttribute, bindable} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {DOM} from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('route-href');

@customAttribute('route-href')
@bindable({name: 'route', changeHandler: 'processChange', primaryProperty: true})
@bindable({name: 'params', changeHandler: 'processChange'})
@bindable({name: 'attribute', defaultValue: 'href'})
export class RouteHref {

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
    return this.router.ensureConfigured()
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
      }).catch(reason => {
        logger.error(reason);
      });
  }
}
