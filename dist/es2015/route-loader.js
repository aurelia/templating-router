var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { CompositionEngine, useView, customElement } from 'aurelia-templating';
import { RouteLoader, Router } from 'aurelia-router';
import { relativeToFile } from 'aurelia-path';
import { Origin } from 'aurelia-metadata';
import { RouterViewLocator } from './router-view';

export let TemplatingRouteLoader = (_dec = inject(CompositionEngine), _dec(_class = class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();

    let viewModel = /\.html/.test(config.moduleId) ? createDynamicClass(config.moduleId) : relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);

    let instruction = {
      viewModel: viewModel,
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.registerSingleton(RouterViewLocator);

    childContainer.getChildRouter = function () {
      let childRouter;

      childContainer.registerHandler(Router, c => {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  }
}) || _class);

function createDynamicClass(moduleId) {
  var _dec2, _dec3, _class2;

  let name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  let DynamicClass = (_dec2 = customElement(name), _dec3 = useView(moduleId), _dec2(_class2 = _dec3(_class2 = class DynamicClass {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }) || _class2) || _class2);


  return DynamicClass;
}