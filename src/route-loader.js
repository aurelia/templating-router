import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';
import {relativeToFile} from 'aurelia-path';
import {Origin} from 'aurelia-metadata';

export class RouteLoaderStrategy extends RouteLoader {
  constructor(router, config, compositionEngine) {
    this.router = router
    this.config = config
    this.compositionEngine = compositionEngine
  }

  get parentModuleId() {
    return Origin.get(this.router.container.viewModel.constructor).moduleId;
  }

  // enable router to define strategy for resolving View Model location
  findViewModelLocation() {
    if (this.router.findViewModelLocation) {
      return this.router.findViewModelLocation(this.config);
    }

    return relativeToFile(this.config.moduleId, this.parentModuleId);
  }

  get childContainer() {
    return this.router.container.createChild();
  }

  get instruction() {
    return {
      viewModel: this.findViewModelLocation(),
      childContainer: this.childContainer,
      view: this.config.view || this.config.viewStrategy,
      router: this.router
    };
  }

  load() {
    childContainer.getChildRouter = function() {
      let childRouter;

      childContainer.registerHandler(Router, c => {
        return childRouter || (childRouter = this.router.createChild(childContainer));
      });

      return childContainer.get(Router);
    };

    return this.compositionEngine.ensureViewModel(this.instruction);
  }
}

function createDefaultRouteLoaderStrategy(router, config, compositionEngine) {
  return new RouteLoaderStrategy(router, config, compositionEngine)
}

@inject(CompositionEngine)
export class TemplatingRouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config = {}) {
    let createRouteLoaderStrategy = router.createRouteLoaderStrategy ||
                                    createDefaultRouteLoaderStrategy

    const routeStrategy = createRouteLoaderStrategy(router, config, this.compositionEngine)
    return routeStrategy.load()
  }
}
