import { Router, RouteLoader, AppRouter } from 'aurelia-router';
import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { ViewSlot, ViewLocator, CompositionTransaction, CompositionEngine, BehaviorInstruction, ShadowDOM, SwapStrategies, inlineView, customElement, useView } from 'aurelia-templating';
import { Container } from 'aurelia-dependency-injection';
import { createOverrideContext } from 'aurelia-binding';
import { DOM } from 'aurelia-pal';
import { getLogger } from 'aurelia-logging';

class EmptyLayoutViewModel {
}
/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
class RouterView {
    constructor(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
        this.element = element;
        this.container = container;
        this.viewSlot = viewSlot;
        this.router = router;
        this.viewLocator = viewLocator;
        this.compositionTransaction = compositionTransaction;
        this.compositionEngine = compositionEngine;
        // add this <router-view/> to router view ports lookup based on name attribute
        // when this router is the root router-view
        // also trigger AppRouter registerViewPort extra flow
        this.router.registerViewPort(this, this.element.getAttribute('name'));
        // Each <router-view/> process its instruction as a composition transaction
        // there are differences between intial composition and subsequent compositions
        // also there are differences between root composition and child <router-view/> composition
        // mark the first composition transaction with a property initialComposition to distinguish it
        // when the root <router-view/> gets new instruction for the first time
        if (!('initialComposition' in compositionTransaction)) {
            compositionTransaction.initialComposition = true;
            this.compositionTransactionNotifier = compositionTransaction.enlist();
        }
    }
    /**@internal */
    static inject() {
        return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
    }
    created(owningView) {
        this.owningView = owningView;
    }
    bind(bindingContext, overrideContext) {
        // router needs to get access to view model of current route parent
        // doing it in generic way via viewModel property on container
        this.container.viewModel = bindingContext;
        this.overrideContext = overrideContext;
    }
    /**
     * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
     */
    process($viewPortInstruction, waitToSwap) {
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        const viewPortInstruction = $viewPortInstruction;
        const component = viewPortInstruction.component;
        const childContainer = component.childContainer;
        const viewModel = component.viewModel;
        const viewModelResource = component.viewModelResource;
        const metadata = viewModelResource.metadata;
        const config = component.router.currentInstruction.config;
        const viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
        childContainer.get(RouterViewLocator)._notify(this);
        // layoutInstruction is our layout viewModel
        const layoutInstruction = {
            viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
            view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
            model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
            router: viewPortInstruction.component.router,
            childContainer: childContainer,
            viewSlot: this.viewSlot
        };
        // viewport will be a thin wrapper around composition engine
        // to process instruction/configuration from users
        // preparing all information related to a composition process
        // first by getting view strategy of a ViewPortComponent View
        const viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
        if (viewStrategy && component.view) {
            viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
        }
        // using metadata of a custom element view model to load appropriate view-factory instance
        return metadata
            .load(childContainer, viewModelResource.value, null, viewStrategy, true)
            // for custom element, viewFactory typing is always ViewFactory
            // for custom attribute, it will be HtmlBehaviorResource
            .then((viewFactory) => {
            // if this is not the first time that this <router-view/> is composing its instruction
            // try to capture ownership of the composition transaction
            // child <router-view/> will not be able to capture, since root <router-view/> typically captures
            // the ownership token
            if (!this.compositionTransactionNotifier) {
                this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
            }
            if (layoutInstruction.viewModel || layoutInstruction.view) {
                viewPortInstruction.layoutInstruction = layoutInstruction;
            }
            const viewPortComponentBehaviorInstruction = BehaviorInstruction.dynamic(this.element, viewModel, viewFactory);
            viewPortInstruction.controller = metadata.create(childContainer, viewPortComponentBehaviorInstruction);
            if (waitToSwap) {
                return null;
            }
            this.swap(viewPortInstruction);
        });
    }
    swap($viewPortInstruction) {
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        const viewPortInstruction = $viewPortInstruction;
        const viewPortController = viewPortInstruction.controller;
        const layoutInstruction = viewPortInstruction.layoutInstruction;
        const previousView = this.view;
        // Final step of swapping a <router-view/> ViewPortComponent
        const work = () => {
            const swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
            const viewSlot = this.viewSlot;
            swapStrategy(viewSlot, previousView, () => Promise.resolve(viewSlot.add(this.view))).then(() => {
                this._notify();
            });
        };
        // Ensure all users setups have been completed
        const ready = (owningView_or_layoutView) => {
            viewPortController.automate(this.overrideContext, owningView_or_layoutView);
            const transactionOwnerShipToken = this.compositionTransactionOwnershipToken;
            // if this router-view is the root <router-view/> of a normal startup via aurelia.setRoot
            // attemp to take control of the transaction
            // if ownership can be taken
            // wait for transaction to complete before swapping
            if (transactionOwnerShipToken) {
                return transactionOwnerShipToken
                    .waitForCompositionComplete()
                    .then(() => {
                    this.compositionTransactionOwnershipToken = null;
                    return work();
                });
            }
            // otherwise, just swap
            return work();
        };
        // If there is layout instruction, new to compose layout before processing ViewPortComponent
        // layout controller/view/view-model is composed using composition engine APIs
        if (layoutInstruction) {
            if (!layoutInstruction.viewModel) {
                // createController chokes if there's no viewmodel, so create a dummy one
                // but avoid using a POJO as it creates unwanted metadata in Object constructor
                layoutInstruction.viewModel = new EmptyLayoutViewModel();
            }
            // using composition engine to create compose layout
            return this.compositionEngine
                // first create controller from layoutInstruction
                // and treat it as CompositionContext
                // then emulate slot projection with ViewPortComponent view
                .createController(layoutInstruction)
                .then((layoutController) => {
                const layoutView = layoutController.view;
                ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                // when there is a layout
                // view hierarchy is: <router-view/> owner view -> layout view -> ViewPortComponent view
                layoutController.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
                layoutView.children.push(viewPortController.view);
                return layoutView || layoutController;
            })
                .then((newView) => {
                this.view = newView;
                return ready(newView);
            });
        }
        // if there is no layout, then get ViewPortComponent view ready as view property
        // and process controller/swapping
        // when there is no layout
        // view hierarchy is: <router-view/> owner view -> ViewPortComponent view
        this.view = viewPortController.view;
        return ready(this.owningView);
    }
    /**
     * Notify composition transaction that this router has finished processing
     * Happens when this <router-view/> is the root router-view
     * @internal
     */
    _notify() {
        const notifier = this.compositionTransactionNotifier;
        if (notifier) {
            notifier.done();
            this.compositionTransactionNotifier = null;
        }
    }
}
/**
 * @internal Actively avoid using decorator to reduce the amount of code generated
 *
 * There is no view to compose by default in a router view
 * This custom element is responsible for composing its own view, based on current config
 */
RouterView.$view = null;
/**
 * @internal Actively avoid using decorator to reduce the amount of code generated
 */
RouterView.$resource = {
    name: 'router-view',
    bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context']
};
/**
* Locator which finds the nearest RouterView, relative to the current dependency injection container.
*/
class RouterViewLocator {
    /**
    * Creates an instance of the RouterViewLocator class.
    */
    constructor() {
        this.promise = new Promise((resolve) => this.resolve = resolve);
    }
    /**
    * Finds the nearest RouterView instance.
    * @returns A promise that will be resolved with the located RouterView instance.
    */
    findNearest() {
        return this.promise;
    }
    /**@internal */
    _notify(routerView) {
        this.resolve(routerView);
    }
}

/**@internal exported for unit testing */
class EmptyClass {
}
inlineView('<template></template>')(EmptyClass);
/**
 * Default implementation of `RouteLoader` used for loading component based on a route config
 */
class TemplatingRouteLoader extends RouteLoader {
    constructor(compositionEngine) {
        super();
        this.compositionEngine = compositionEngine;
    }
    /**
     * Resolve a view model from a RouteConfig
     * Throws when there is neither "moduleId" nor "viewModel" property
     * @internal
     */
    resolveViewModel(router, config) {
        return new Promise((resolve, reject) => {
            let viewModel;
            if ('moduleId' in config) {
                let moduleId = config.moduleId;
                if (moduleId === null) {
                    viewModel = EmptyClass;
                }
                else {
                    // this requires container of router has passes a certain point
                    // where a view model has been setup on the container
                    // it will fail in enhance scenario because no viewport has been registered
                    moduleId = relativeToFile(moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
                    if (/\.html/i.test(moduleId)) {
                        viewModel = createDynamicClass(moduleId);
                    }
                    else {
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
    createChildContainer(router) {
        const childContainer = router.container.createChild();
        childContainer.registerSingleton(RouterViewLocator);
        childContainer.getChildRouter = function () {
            let childRouter;
            childContainer.registerHandler(Router, () => childRouter || (childRouter = router.createChild(childContainer)));
            return childContainer.get(Router);
        };
        return childContainer;
    }
    /**
     * Load corresponding component of a route config of a navigation instruction
     */
    loadRoute(router, config, _navInstruction) {
        return this
            .resolveViewModel(router, config)
            .then(viewModel => this.compositionEngine.ensureViewModel({
            viewModel: viewModel,
            childContainer: this.createChildContainer(router),
            view: config.view || config.viewStrategy,
            router: router
        }));
    }
}
/**@internal */
TemplatingRouteLoader.inject = [CompositionEngine];
/**@internal exported for unit testing */
function createDynamicClass(moduleId) {
    const name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];
    class DynamicClass {
        bind(bindingContext) {
            this.$parent = bindingContext;
        }
    }
    customElement(name)(DynamicClass);
    useView(moduleId)(DynamicClass);
    return DynamicClass;
}

const logger = getLogger('route-href');
/**
 * Helper custom attribute to help associate an element with a route by name
 */
class RouteHref {
    constructor(router, element) {
        this.router = router;
        this.element = element;
        this.attribute = 'href';
    }
    /*@internal */
    static inject() {
        return [Router, DOM.Element];
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
        return this.processChange();
    }
    processChange() {
        return this.router
            .ensureConfigured()
            .then(() => {
            if (!this.isActive) {
                // returning null to avoid Bluebird warning
                return null;
            }
            const element = this.element;
            const href = this.router.generate(this.route, this.params);
            if (element.au.controller) {
                element.au.controller.viewModel[this.attribute] = href;
            }
            else {
                element.setAttribute(this.attribute, href);
            }
            // returning null to avoid Bluebird warning
            return null;
        })
            .catch((reason) => {
            logger.error(reason);
        });
    }
}
/**
 * @internal Actively avoid using decorator to reduce the amount of code generated
 */
RouteHref.$resource = {
    type: 'attribute',
    name: 'route-href',
    bindables: [
        { name: 'route', changeHandler: 'processChange', primaryProperty: true },
        { name: 'params', changeHandler: 'processChange' },
        'attribute'
    ] // type definition of Aurelia templating is wrong
};

function configure(config) {
    config
        .singleton(RouteLoader, TemplatingRouteLoader)
        .singleton(Router, AppRouter)
        .globalResources(RouterView, RouteHref);
    config.container.registerAlias(Router, AppRouter);
}

export { RouteHref, RouterView, TemplatingRouteLoader, configure };
//# sourceMappingURL=aurelia-templating-router.js.map
