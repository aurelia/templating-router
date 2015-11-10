System.register(['aurelia-templating', 'aurelia-dependency-injection', 'aurelia-router', 'aurelia-pal', 'aurelia-logging'], function (_export) {
  'use strict';

  var customAttribute, bindable, inject, Router, DOM, LogManager, logger, RouteHref;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      bindable = _aureliaTemplating.bindable;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      logger = LogManager.getLogger('route-href');

      RouteHref = (function () {
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
        RouteHref = inject(Router, DOM.Element)(RouteHref) || RouteHref;
        RouteHref = bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref) || RouteHref;
        RouteHref = bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref) || RouteHref;
        RouteHref = bindable({ name: 'route', changeHandler: 'processChange' })(RouteHref) || RouteHref;
        RouteHref = customAttribute('route-href')(RouteHref) || RouteHref;
        return RouteHref;
      })();

      _export('RouteHref', RouteHref);
    }
  };
});