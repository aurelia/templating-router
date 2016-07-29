import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  /*
   * Calculate the view model location
   * By convention this is the responsibility of the Router, but if need be you can
   * override this on a per application basis here
   *
   * @param router The router
   * @param config The route config
   * @returns {string} the view model file location
  */
  viewModelLocation(router, config) {
    return router.viewModelLocation(config);
  }

  /*
   * Loads the route
   *
   * @param router The router
   * @param config The route config
  */
  loadRoute(router, config) {
    let childContainer = router.container.createChild();
    let instruction = {
      viewModel: this.viewModelLocation(router, config),
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
