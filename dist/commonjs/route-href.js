'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _customAttribute$bindable = require('aurelia-templating');

var _inject = require('aurelia-dependency-injection');

var _Router = require('aurelia-router');

var RouteHref = (function () {
  function RouteHref(router, element) {
    _classCallCheck(this, _RouteHref);

    this.router = router;
    this.element = element;
  }

  var _RouteHref = RouteHref;

  _RouteHref.prototype.bind = function bind() {
    this.processChange();
  };

  _RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  };

  _RouteHref.prototype.processChange = function processChange() {
    var href = this.router.generate(this.route, this.params);
    this.element.setAttribute(this.attribute, href);
  };

  RouteHref = _inject.inject(_Router.Router, Element)(RouteHref) || RouteHref;
  RouteHref = _customAttribute$bindable.bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref) || RouteHref;
  RouteHref = _customAttribute$bindable.bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _customAttribute$bindable.bindable({ name: 'route', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _customAttribute$bindable.customAttribute('route-href')(RouteHref) || RouteHref;
  return RouteHref;
})();

exports.RouteHref = RouteHref;