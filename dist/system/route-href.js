'use strict';

System.register(['aurelia-templating', 'aurelia-router', 'aurelia-pal', 'aurelia-logging'], function (_export, _context) {
  "use strict";

  var customAttribute, bindable, Router, DOM, LogManager, _dec, _dec2, _dec3, _dec4, _class, logger, RouteHref;

  

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      bindable = _aureliaTemplating.bindable;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      logger = LogManager.getLogger('route-href');

      _export('RouteHref', RouteHref = (_dec = customAttribute('route-href'), _dec2 = bindable({ name: 'route', changeHandler: 'processChange', primaryProperty: true }), _dec3 = bindable({ name: 'params', changeHandler: 'processChange' }), _dec4 = bindable({ name: 'attribute', defaultValue: 'href' }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
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
      }()) || _class) || _class) || _class) || _class));

      _export('RouteHref', RouteHref);
    }
  };
});