import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { NavigationInstruction, RouteConfig, RouteLoader, Router, ViewPortComponent } from 'aurelia-router';
import { CompositionEngine, customElement, inlineView, useView } from 'aurelia-templating';
import { RouterViewLocator } from './router-view';

/**@internal exported for unit testing */
export class EmptyClass { }
inlineView('<template></template>')(EmptyClass);

export class TemplatingRouteLoader extends RouteLoader {

  /**@internal */
  static inject = [CompositionEngine];

  compositionEngine: CompositionEngine;

  constructor(
    compositionEngine: CompositionEngine
  ) {
    super();
    this.compositionEngine = compositionEngine;
  }

  /**
   * @internal Resolve a view model from a RouteConfig
   * Throws when there is neither "moduleId" nor "viewModel" property
   */
  resolveViewModel(router: Router, config: RouteConfig): Promise<string | null | Function> {
    let promise: Promise<string | /**Constructable */ Function | null>;
    // let viewModel: string | /**Constructable */ Function | null | Record<string, any>;
    if ('moduleId' in config) {
      let viewModel: string | Function;
      let moduleId = config.moduleId;
      if (moduleId === null) {
        viewModel = EmptyClass;
      } else if (/\.html/i.test(moduleId)) {
        viewModel = createDynamicClass(moduleId);
      } else {
        viewModel = relativeToFile(moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
      }
      promise = Promise.resolve(viewModel);
    } else if ('viewModel' in config) {
      // Implementation wise, the router already ensure this is a synchronous call
      // but interface wise it's annoying
      promise = Promise
        .resolve()
        .then(() => config.viewModel())
        .then(vm => {
          if (vm && typeof vm === 'object') {
            // viewModel: () => import('...')
            vm = vm.default;
          }
          if (typeof vm === 'function') {
            return vm;
          }
          throw new Error('Invalid view model config');
        });
    } else {
      return Promise.reject(new Error('Invalid route config. No "moduleId"/"viewModel" found.'));
    }
    return promise;
  }

  loadRoute(router: Router, config: RouteConfig, _navInstruction: NavigationInstruction): Promise<ViewPortComponent> {
    return this
      .resolveViewModel(router, config)
      .then(viewModel => {
        const childContainer = router.container.createChild();
        const instruction = {
          viewModel: viewModel,
          childContainer: childContainer,
          view: config.view || config.viewStrategy,
          router: router
        } as ViewPortComponent;

        childContainer.registerSingleton(RouterViewLocator);

        childContainer.getChildRouter = function() {
          let childRouter: Router;

          childContainer.registerHandler(Router, () => {
            return childRouter || (childRouter = router.createChild(childContainer));
          });

          return childContainer.get(Router);
        };
        return this.compositionEngine.ensureViewModel(instruction) as Promise<ViewPortComponent>;
      });
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
