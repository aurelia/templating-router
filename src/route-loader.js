import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';
import {relativeToFile} from 'aurelia-path';
import {Origin} from 'aurelia-metadata';

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  // enable router to define strategy for resolving View Model location
  findViewModelLocation(router, config) {
    // allow router to override general strategy for locating view model
    if (router.findViewModelLocation) {
      return router.findViewModelLocation(config);
    }
    let parentModuleId = Origin.get(router.container.viewModel.constructor).moduleId;
    return relativeToFile(config.moduleId, parentModuleId);
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();
    let instruction = {
      viewModel: this.findViewModelLocation(router, config),
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.getChildRouter = function() {
      let childRouter;

      childContainer.registerHandler(Router, c => {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  }
}
