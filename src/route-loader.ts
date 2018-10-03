import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { NavigationInstruction, RouteConfig, RouteLoader, Router, ViewPortComponent } from 'aurelia-router';
import { CompositionEngine, customElement, inlineView, useView } from 'aurelia-templating';
import { RouterViewLocator } from './router-view';

class EmptyClass { }
inlineView('<template></template>')(EmptyClass);

export class TemplatingRouteLoader extends RouteLoader {

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

    let viewModel;
    if (config.moduleId === null) {
      viewModel = EmptyClass;
    } else if (/\.html/i.test(config.moduleId)) {
      viewModel = createDynamicClass(config.moduleId);
    } else {
      viewModel = relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
    }

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

    return this.compositionEngine.ensureViewModel(instruction) as any;
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
