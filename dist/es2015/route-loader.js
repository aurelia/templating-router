var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { CompositionEngine } from 'aurelia-templating';
import { RouteLoader, Router } from 'aurelia-router';
import { relativeToFile } from 'aurelia-path';
import { Origin } from 'aurelia-metadata';

export let TemplatingRouteLoader = (_dec = inject(CompositionEngine), _dec(_class = class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();
    let instruction = {
      viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

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