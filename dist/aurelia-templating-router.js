import * as LogManager from 'aurelia-logging';
import {customAttribute,bindable,ViewSlot,ViewLocator,customElement,noView,BehaviorInstruction,CompositionTransaction,CompositionEngine,ShadowDOM} from 'aurelia-templating';
import {inject,Container} from 'aurelia-dependency-injection';
import {Router,RouteLoader} from 'aurelia-router';
import {DOM} from 'aurelia-pal';
import {createOverrideContext} from 'aurelia-binding';
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
          return null;
        }

        let href = this.router.generate(this.route, this.params);

        if (this.element.au.controller) {
          this.element.au.controller.viewModel[this.attribute] = href;
        } else {
          this.element.setAttribute(this.attribute, href);
        }

        return null;
      }).catch(reason => {
        logger.error(reason);
      });
  }
}

class SwapStrategies {
  // animate the next view in before removing the current view;
  before(viewSlot, previousView, callback) {
    let promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return promise.then(() => viewSlot.remove(previousView, true));
    }

    return promise;
  }

  // animate the next view at the same time the current view is removed
  with(viewSlot, previousView, callback) {
    let promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return Promise.all([viewSlot.remove(previousView, true), promise]);
    }

    return promise;
  }

  // animate the next view in after the current view has been removed
  after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  }
}

const swapStrategies = new SwapStrategies();

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine)
export class RouterView {
  @bindable swapOrder;
  @bindable layoutView;
  @bindable layoutViewModel;
  @bindable layoutModel;

  constructor(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  created(owningView) {
    this.owningView = owningView;
  }

  bind(bindingContext, overrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  }

  process(viewPortInstruction, waitToSwap) {
    let component = viewPortInstruction.component;
    let childContainer = component.childContainer;
    let viewModel = component.viewModel;
    let viewModelResource = component.viewModelResource;
    let metadata = viewModelResource.metadata;
    let config = component.router.currentInstruction.config;
    let viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] : {};

    // layoutInstruction is our layout viewModel
    let layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    let viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true)
    .then(viewFactory => {
      if (!this.compositionTransactionNotifier) {
        this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
      }

      if (layoutInstruction.viewModel || layoutInstruction.view) {
        viewPortInstruction.layoutInstruction = layoutInstruction;
      }

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
    let layoutInstruction = viewPortInstruction.layoutInstruction;

    let work = () => {
      let previousView = this.view;
      let swapStrategy;
      let viewSlot = this.viewSlot;

      swapStrategy = this.swapOrder in swapStrategies
                  ? swapStrategies[this.swapOrder]
                  : swapStrategies.after;

      swapStrategy(viewSlot, previousView, () => {
        return Promise.resolve().then(() => {
          return viewSlot.add(this.view);
        }).then(() => {
          this._notify();
        });
      });
    };

    let ready = owningView => {
      viewPortInstruction.controller.automate(this.overrideContext, owningView);
      if (this.compositionTransactionOwnershipToken) {
        return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => {
          this.compositionTransactionOwnershipToken = null;
          return work();
        });
      }

      return work();
    };

    if (layoutInstruction) {
      if (!layoutInstruction.viewModel) {
        // createController chokes if there's no viewmodel, so create a dummy one
        // should we use something else for the view model here?
        layoutInstruction.viewModel = {};
      }

      return this.compositionEngine.createController(layoutInstruction).then(controller => {
        ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
        controller.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
        controller.view.children.push(viewPortInstruction.controller.view);
        return controller.view || controller;
      }).then(newView => {
        this.view = newView;
        return ready(newView);
      });
    }

    this.view = viewPortInstruction.controller.view;

    return ready(this.owningView);
  }

  _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  }
}

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine) {
    super();
    this.compositionEngine = compositionEngine;
  }

  findViewModelLocation(router, config) {
    // allow router to override general strategy for locating view model
    if (router.findViewModelLocation) {
      return router.findViewModelLocation(config);
    }    
    let parentModuleId = Origin.get(router.container.viewModel.constructor).moduleId;
    return relativeToFile(config.moduleId, parentModuleId);
  }

  loadRoute(router, config) {
    let childContainer = router.container.createChild();
    let instruction = {
      viewModel: this.findViewModelLocation(router, config),
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
