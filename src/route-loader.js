import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine, useView, inlineView, customElement, HtmlBehaviorResource} from 'aurelia-templating';
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

    let viewModel;
    let isPromise = false;

    if (config.moduleId === null) {
      viewModel = EmptyClass;
    } else {
      if (typeof config.moduleId === 'string') {
        if (/\.html$/i.test(config.moduleId)) {
          viewModel = createDynamicClass(config.moduleId);
        } else {
          viewModel = relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
        }
      } else if (typeof config.moduleId === 'function') {
        // view model class given
        childContainer.autoRegister(config.moduleId);

        /**@type {HtmlBehaviorResource} */
        let m = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, config.moduleId);
        m.elementName = m.elementName || 'dynamic-element';
        m.initialize(childContainer, config.moduleId);
        viewModel = childContainer.get(config.moduleId);
      } else if (config.moduleId instanceof Promise) {
        // dynamic loading
        isPromise = true;
      } else {
        throw new Error('Unsupported "moduleId" config');
      }
    }

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

    if (isPromise) {
      return config.moduleId.then(viewModelClass => {
        if (typeof viewModelClass !== 'function') {
          throw new Error(`Unsupported moduleId config. Expected class / function, actual: ${typeof viewModelClass}`);
        }
        childContainer.autoRegister(viewModelClass);

        /**@type {HtmlBehaviorResource} */
        let m = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, viewModelClass);
        m.elementName = m.elementName || 'dynamic-element';
        m.initialize(childContainer, viewModelClass);
        instruction.viewModel = childContainer.get(viewModelClass);
        return this.compositionEngine.ensureViewModel(instruction);
      });
    }

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
