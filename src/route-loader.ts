import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { NavigationInstruction, RouteConfig, RouteLoader, Router } from 'aurelia-router';
import { CompositionEngine, customElement, inlineView, useView, CompositionContext } from 'aurelia-templating';
import { RouterViewLocator } from './router-view';
import { Container } from 'aurelia-dependency-injection';

/**@internal exported for unit testing */
export class EmptyClass { }
inlineView('<template></template>')(EmptyClass);

/**
 * Default implementation of `RouteLoader` used for loading component based on a route config
 */
export class TemplatingRouteLoader extends RouteLoader {

  /**@internal */
  static inject = [CompositionEngine];

  /**@internal */
  compositionEngine: CompositionEngine;

  constructor(
    compositionEngine: CompositionEngine
  ) {
    super();
    this.compositionEngine = compositionEngine;
  }

  /**
   * Resolve a view model from a RouteConfig
   * Throws when there is neither "moduleId" nor "viewModel" property
   * @internal
   */
  resolveViewModel(router: Router, config: RouteConfig): Promise<string | null | Function> {
    return new Promise((resolve, reject) => {
      let viewModel: string | null | Function;
      if ('moduleId' in config) {
        let moduleId = config.moduleId;
        if (moduleId === null) {
          viewModel = EmptyClass;
        } else {
          // this requires container of router has passes a certain point
          // where a view model has been setup on the container
          // it will fail in enhance scenario because no viewport has been registered
          moduleId = relativeToFile(moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
          if (/\.html/i.test(moduleId)) {
            viewModel = createDynamicClass(moduleId);
          } else {
            viewModel = moduleId;
          }
        }
        return resolve(viewModel);
      }
      // todo: add if ('viewModel' in config) to support static view model resolution
      reject(new Error('Invalid route config. No "moduleId" found.'));
    });
  }

  /**
   * Create child container based on a router container
   * Also ensures that child router are properly constructed in the newly created child container
   * @internal
   */
  createChildContainer(router: Router): Container {
    const childContainer = router.container.createChild();

    childContainer.registerSingleton(RouterViewLocator);
    childContainer.getChildRouter = function() {
      let childRouter: Router;

      childContainer.registerHandler(
        Router,
        () => childRouter || (childRouter = router.createChild(childContainer))
      );

      return childContainer.get(Router);
    };
    return childContainer;
  }

  /**
   * Load corresponding component of a route config of a navigation instruction
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadRoute(router: Router, config: RouteConfig, navInstruction: NavigationInstruction): Promise<any> {
    return this
      .resolveViewModel(router, config)
      .then(viewModel => this.compositionEngine.ensureViewModel({
        viewModel: viewModel,
        childContainer: this.createChildContainer(router),
        view: config.view || config.viewStrategy,
        router: router
      } as CompositionContext));
  }
}

/**@internal exported for unit testing */
export function createDynamicClass(moduleId: string) {
  const name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  class DynamicClass {

    $parent: any;

    bind(bindingContext: any) {
      this.$parent = bindingContext;
    }
  }

  customElement(name)(DynamicClass);
  useView(moduleId)(DynamicClass);

  return DynamicClass;
}
