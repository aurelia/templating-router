import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { NavigationInstruction, RouteConfig, RouteLoader, Router, ViewPortComponent } from 'aurelia-router';
import { CompositionEngine, customElement, inlineView, useView } from 'aurelia-templating';
import { RouterViewLocator } from './router-view';

const moduleIdPropName = 'moduleId';
const viewModelPropName = 'viewModel';

class EmptyClass { }
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

  loadRoute(router: Router, config: RouteConfig, _navInstruction: NavigationInstruction): Promise<ViewPortComponent> {
    const childContainer = router.container.createChild();

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
        .resolve(config.viewModel())
        .then(vm => {
          if (typeof vm === 'function') {
            return vm;
          }
          if (vm && typeof vm === 'object') {
            // viewModel: () => import('...')
            return vm.default;
          }
          throw new Error('Invalid view model config');
        });
    } else {
      throw new Error('Invalid route config. No "moduleId"/"viewModel" found.');
    }

    return promise
      .then(viewModel => {
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

function createDynamicClass(moduleId: string) {
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
