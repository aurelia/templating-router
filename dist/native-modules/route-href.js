var _dec, _dec2, _dec3, _dec4, _class;



import { customAttribute, bindable } from 'aurelia-templating';
import { Router } from 'aurelia-router';
import { DOM } from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';

var logger = LogManager.getLogger('route-href');

export var RouteHref = (_dec = customAttribute('route-href'), _dec2 = bindable({ name: 'route', changeHandler: 'processChange', primaryProperty: true }), _dec3 = bindable({ name: 'params', changeHandler: 'processChange' }), _dec4 = bindable({ name: 'attribute', defaultValue: 'href' }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
  RouteHref.inject = function inject() {
    return [Router, DOM.Element];
  };

  function RouteHref(router, element) {
    

    this.router = router;
    this.element = element;
  }

  RouteHref.prototype.bind = function bind() {
    this.isActive = true;
    this.processChange();
  };

  RouteHref.prototype.unbind = function unbind() {
    this.isActive = false;
  };

  RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  };

  RouteHref.prototype.processChange = function processChange() {
    var _this = this;

    return this.router.ensureConfigured().then(function () {
      if (!_this.isActive) {
        return null;
      }

      var href = _this.router.generate(_this.route, _this.params);

      if (_this.element.au.controller) {
        _this.element.au.controller.viewModel[_this.attribute] = href;
      } else {
        _this.element.setAttribute(_this.attribute, href);
      }

      return null;
    }).catch(function (reason) {
      logger.error(reason);
    });
  };

  return RouteHref;
}()) || _class) || _class) || _class) || _class);