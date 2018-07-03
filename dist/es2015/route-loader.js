var _dec, _class, _dec2, _class2;

import { inject } from 'aurelia-dependency-injection';
import { CompositionEngine, useView, inlineView, customElement } from 'aurelia-templating';
import { RouteLoader, Router } from 'aurelia-router';
import { relativeToFile } from 'aurelia-path';
import { Origin } from 'aurelia-metadata';
import { RouterViewLocator } from './router-view';

let EmptyClass = (_dec = inlineView('<template></template>'), _dec(_class = class EmptyClass {}) || _class);

export let TemplatingRouteLoader = (_dec2 = inject(CompositionEngine), _dec2(_class2 = class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();

    let viewModel;
    if (config.moduleId === null) {
      viewModel = EmptyClass;
    } else if (/\.html/i.test(config.moduleId)) {
      viewModel = createDynamicClass(config.moduleId);
    } else {
      viewModel = relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
    }

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
}) || _class2);

function createDynamicClass(moduleId) {
  var _dec3, _dec4, _class3;

  let name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  let DynamicClass = (_dec3 = customElement(name), _dec4 = useView(moduleId), _dec3(_class3 = _dec4(_class3 = class DynamicClass {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }) || _class3) || _class3);


  return DynamicClass;
}