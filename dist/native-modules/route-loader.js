var _dec, _class, _dec2, _class2;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



import { inject } from 'aurelia-dependency-injection';
import { CompositionEngine, useView, inlineView, customElement } from 'aurelia-templating';
import { RouteLoader, Router } from 'aurelia-router';
import { relativeToFile } from 'aurelia-path';
import { Origin } from 'aurelia-metadata';
import { RouterViewLocator } from './router-view';

var EmptyClass = (_dec = inlineView('<template></template>'), _dec(_class = function EmptyClass() {
  
}) || _class);

export var TemplatingRouteLoader = (_dec2 = inject(CompositionEngine), _dec2(_class2 = function (_RouteLoader) {
  _inherits(TemplatingRouteLoader, _RouteLoader);

  function TemplatingRouteLoader(compositionEngine) {
    

    var _this = _possibleConstructorReturn(this, _RouteLoader.call(this));

    _this.compositionEngine = compositionEngine;
    return _this;
  }

  TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild();

    var viewModel = void 0;
    if (config.moduleId === null) {
      viewModel = EmptyClass;
    } else if (/\.html/i.test(config.moduleId)) {
      viewModel = createDynamicClass(config.moduleId);
    } else {
      viewModel = relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
    }

    var instruction = {
      viewModel: viewModel,
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.registerSingleton(RouterViewLocator);

    childContainer.getChildRouter = function () {
      var childRouter = void 0;

      childContainer.registerHandler(Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  };

  return TemplatingRouteLoader;
}(RouteLoader)) || _class2);

function createDynamicClass(moduleId) {
  var _dec3, _dec4, _class3;

  var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  var DynamicClass = (_dec3 = customElement(name), _dec4 = useView(moduleId), _dec3(_class3 = _dec4(_class3 = function () {
    function DynamicClass() {
      
    }

    DynamicClass.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicClass;
  }()) || _class3) || _class3);


  return DynamicClass;
}