import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine, useView, inlineView, customElement} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';
import {relativeToFile} from 'aurelia-path';
import {Origin} from 'aurelia-metadata';
import {RouterViewLocator} from './router-view';

@inlineView('<template></template>')
class EmptyClass { }

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();

    let viewModel = config === null
      ? createEmptyClass()
      : /\.html/.test(config.moduleId)
        ? createDynamicClass(config.moduleId)
        : relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
    
    config = config || {};

    let instruction = {
      viewModel: viewModel,
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.registerSingleton(RouterViewLocator);

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

function createDynamicClass(moduleId) {
  let name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  @customElement(name)
  @useView(moduleId)
  class DynamicClass {
    bind(bindingContext) {
      this.$parent = bindingContext;
    }
  }

  return DynamicClass;
}

function createEmptyClass() {
  @inlineView('<template></template>')
  class EmptyClass { }

  return EmptyClass;
}
