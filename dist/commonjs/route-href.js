'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaRouter = require('aurelia-router');

var _aureliaPal = require('aurelia-pal');

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var logger = LogManager.getLogger('route-href');

var RouteHref = (function () {
  function RouteHref(router, element) {
    _classCallCheck(this, _RouteHref);

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
        return;
      }

      var href = _this.router.generate(_this.route, _this.params);
      _this.element.setAttribute(_this.attribute, href);
    })['catch'](function (reason) {
      logger.error(reason);
    });
  };

  var _RouteHref = RouteHref;
  RouteHref = _aureliaDependencyInjection.inject(_aureliaRouter.Router, _aureliaPal.DOM.Element)(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'route', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.customAttribute('route-href')(RouteHref) || RouteHref;
  return RouteHref;
})();

exports.RouteHref = RouteHref;