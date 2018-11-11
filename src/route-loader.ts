import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { NavigationInstruction, RouteConfig, RouteLoader, Router, ViewPortComponent } from 'aurelia-router';
import { CompositionEngine, customElement, inlineView, useView, CompositionContext } from 'aurelia-templating';
import { RouterViewLocator } from './router-view';
import { Container } from 'aurelia-framework';

/**@internal exported for unit testing */
export class EmptyClass { }
inlineView('<template></template>')(EmptyClass);

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
   * @internal Resolve a view model from a RouteConfig
   * Throws when there is neither "moduleId" nor "viewModel" property
   */
  resolveViewModel(router: Router, config: RouteConfig): Promise<string | null | Function> {
    return Promise
      .resolve()
      .then(() => {
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
          // TS complains without Promise.resolve. Maybe need to file a bug with in TS repo
          return Promise.resolve(viewModel);
        }
        if ('viewModel' in config) {
          return Promise
            .resolve(config.viewModel())
            .then(vm => {
              const viewModel: Function = vm && typeof vm === 'object'
                // viewModel: () => import('...')
                ? vm.default
                // viewModel: () => class {}
                // viewModel: () => import(...).then(m => m.SomeClass)
                // viewModel: () => Promise.resolve().then(() => SomeClass)
                : vm;
              if (typeof viewModel === 'function') {
                return viewModel;
              }
              throw new Error('Invalid view model config.');
            });
        }
        throw new Error('Invalid route config. No "moduleId"/"viewModel" found.');
      });
  }

  /**
   * @internal
   * Create child container based on a router container
   * Also ensures that child router are properly constructed in the newly created child container
   */
  createChildContainer(router: Router): Container {
    const childContainer = router.container.createChild();

    childContainer.registerSingleton(RouterViewLocator);
    childContainer.getChildRouter = function() {
      let childRouter: Router;

      childContainer.registerHandler(Router, () => {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(Router);
    };
    return childContainer;
  }

  loadRoute(router: Router, config: RouteConfig, _navInstruction: NavigationInstruction): Promise<ViewPortComponent> {
    return this
      .resolveViewModel(router, config)
      .then(viewModel => this.compositionEngine.ensureViewModel(<CompositionContext>{
        viewModel: viewModel,
        childContainer: this.createChildContainer(router),
        view: config.view || config.viewStrategy,
        router: router
      })) as Promise<ViewPortComponent>;
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
