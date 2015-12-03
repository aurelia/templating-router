import * as LogManager from 'aurelia-logging';
import {customAttribute,bindable,ViewSlot,ViewLocator,customElement,noView,BehaviorInstruction,CompositionEngine} from 'aurelia-templating';
import {inject,Container} from 'aurelia-dependency-injection';
import {Router,RouteLoader,AppRouter} from 'aurelia-router';
import {DOM} from 'aurelia-pal';
import {Origin} from 'aurelia-metadata';
import {relativeToFile} from 'aurelia-path';

const logger = LogManager.getLogger('route-href');

@customAttribute('route-href')
@bindable({name: 'route', changeHandler: 'processChange'})
@bindable({name: 'params', changeHandler: 'processChange'})
@bindable({name: 'attribute', defaultValue: 'href'})
@inject(Router, DOM.Element)
export class RouteHref {
  constructor(router, element) {
    this.router = router;
    this.element = element;
  }

  bind() {
    this.isActive = true;
    this.processChange();
  }

  unbind() {
    this.isActive = false;
  }

  attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  }

  processChange() {
    return this.router.ensureConfigured()
      .then(() => {
        if (!this.isActive) {
          return;
        }

        let href = this.router.generate(this.route, this.params);
        this.element.setAttribute(this.attribute, href);
      })
      .catch(reason => {
        logger.error(reason);
      });
  }
}

const swapStrategies = {
  default: 'before',
  // animate the next view in before removing the current view;
  before(viewSlot, previousView, callback) {
    let promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return promise.then(() => viewSlot.remove(previousView, true));
    }

    return promise;
  },
  // animate the next view at the same time the current view is removed
  with(viewSlot, previousView, callback) {
    if (previousView !== undefined) {
      viewSlot.remove(previousView, true);
    }

    return callback();
  },
  // animate the next view in after the current view has been removed
  after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  }
};

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator)
export class RouterView {
  @bindable swapOrder = swapStrategies[swapStrategies.default];

  constructor(element, container, viewSlot, router, viewLocator) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.router.registerViewPort(this, this.element.getAttribute('name'));
  }

  bind(bindingContext) {
    this.container.viewModel = bindingContext;
  }

  process(viewPortInstruction, waitToSwap) {
    let component = viewPortInstruction.component;
    let childContainer = component.childContainer;
    let viewModel = component.viewModel;
    let viewModelResource = component.viewModelResource;
    let metadata = viewModelResource.metadata;

    let viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(viewFactory => {
      viewPortInstruction.controller = metadata.create(childContainer,
        BehaviorInstruction.dynamic(
          this.element,
          viewModel,
          viewFactory
        )
      );

      if (waitToSwap) {
        return;
      }

      this.swap(viewPortInstruction);
    });
  }

  swap(viewPortInstruction) {
    let previousView = this.view;
    let viewSlot = this.viewSlot;
    let swapStrategy = this.swapOrder in swapStrategies
      ? swapStrategies[this.swapOrder]
      : swapStrategies[swapStrategies.default];

    swapStrategy(viewSlot, previousView, addNextView);
    this.view = viewPortInstruction.controller.view;

    function addNextView() {
      viewPortInstruction.controller.automate();
      return viewSlot.add(viewPortInstruction.controller.view);
    }
  }
}

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();
    let instruction = {
      viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
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

function configure(config) {
  config
    .singleton(RouteLoader, TemplatingRouteLoader)
    .singleton(Router, AppRouter)
    .globalResources('./router-view', './route-href');
}

export {
  TemplatingRouteLoader,
  RouterView,
  RouteHref,
  configure
};
