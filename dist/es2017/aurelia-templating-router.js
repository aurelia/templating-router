import { Router, RouteLoader, AppRouter } from 'aurelia-router';
import { Origin } from 'aurelia-metadata';
import { relativeToFile } from 'aurelia-path';
import { ViewSlot, ViewLocator, CompositionTransaction, CompositionEngine, BehaviorInstruction, ShadowDOM, SwapStrategies, inlineView, customElement, useView } from 'aurelia-templating';
import { Container } from 'aurelia-dependency-injection';
import { createOverrideContext } from 'aurelia-binding';
import { DOM } from 'aurelia-pal';
import * as LogManager from 'aurelia-logging';

class EmptyLayoutViewModel {
}
class RouterView {
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
    static inject() {
        return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
    }
    created(owningView) {
        this.owningView = owningView;
    }
    bind(bindingContext, overrideContext) {
        this.container.viewModel = bindingContext;
        this.overrideContext = overrideContext;
    }
    process($viewPortInstruction, waitToSwap) {
        const viewPortInstruction = $viewPortInstruction;
        const component = viewPortInstruction.component;
        const childContainer = component.childContainer;
        const viewModel = component.viewModel;
        const viewModelResource = component.viewModelResource;
        const metadata = viewModelResource.metadata;
        const config = component.router.currentInstruction.config;
        const viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
        childContainer.get(RouterViewLocator)._notify(this);
        const layoutInstruction = {
            viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
            view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
            model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
            router: viewPortInstruction.component.router,
            childContainer: childContainer,
            viewSlot: this.viewSlot
        };
        const viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
        if (viewStrategy && component.view) {
            viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
        }
        return metadata
            .load(childContainer, viewModelResource.value, null, viewStrategy, true)
            .then((viewFactory) => {
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
        const viewPortInstruction = $viewPortInstruction;
        const viewPortController = viewPortInstruction.controller;
        const layoutInstruction = viewPortInstruction.layoutInstruction;
        const previousView = this.view;
        const work = () => {
            const swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
            const viewSlot = this.viewSlot;
            swapStrategy(viewSlot, previousView, () => Promise.resolve(viewSlot.add(this.view))).then(() => {
                this._notify();
            });
        };
        const ready = (owningView_or_layoutView) => {
            viewPortController.automate(this.overrideContext, owningView_or_layoutView);
            const transactionOwnerShipToken = this.compositionTransactionOwnershipToken;
            if (transactionOwnerShipToken) {
                return transactionOwnerShipToken
                    .waitForCompositionComplete()
                    .then(() => {
                    this.compositionTransactionOwnershipToken = null;
                    return work();
                });
            }
            return work();
        };
        if (layoutInstruction) {
            if (!layoutInstruction.viewModel) {
                layoutInstruction.viewModel = new EmptyLayoutViewModel();
            }
            return this.compositionEngine
                .createController(layoutInstruction)
                .then((layoutController) => {
                const layoutView = layoutController.view;
                ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                layoutController.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
                layoutView.children.push(viewPortController.view);
                return layoutView || layoutController;
            })
                .then((newView) => {
                this.view = newView;
                return ready(newView);
            });
        }
        this.view = viewPortController.view;
        return ready(this.owningView);
    }
    _notify() {
        const notifier = this.compositionTransactionNotifier;
        if (notifier) {
            notifier.done();
            this.compositionTransactionNotifier = null;
        }
    }
}
RouterView.$view = null;
RouterView.$resource = {
    name: 'router-view',
    bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context']
};
class RouterViewLocator {
    constructor() {
        this.promise = new Promise((resolve) => this.resolve = resolve);
    }
    findNearest() {
        return this.promise;
    }
    _notify(routerView) {
        this.resolve(routerView);
    }
}

class EmptyClass {
}
inlineView('<template></template>')(EmptyClass);
class TemplatingRouteLoader extends RouteLoader {
    constructor(compositionEngine) {
        super();
        this.compositionEngine = compositionEngine;
    }
    resolveViewModel(router, config) {
        return new Promise((resolve, reject) => {
            let viewModel;
            if ('moduleId' in config) {
                let moduleId = config.moduleId;
                if (moduleId === null) {
                    viewModel = EmptyClass;
                }
                else {
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
            reject(new Error('Invalid route config. No "moduleId" found.'));
        });
    }
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
    loadRoute(router, config, navInstruction) {
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
TemplatingRouteLoader.inject = [CompositionEngine];
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

const logger = LogManager.getLogger('route-href');
class RouteHref {
    constructor(router, element) {
        this.router = router;
        this.element = element;
        this.attribute = 'href';
    }
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
            return null;
        })
            .catch((reason) => {
            logger.error(reason);
        });
    }
}
RouteHref.$resource = {
    type: 'attribute',
    name: 'route-href',
    bindables: [
        { name: 'route', changeHandler: 'processChange', primaryProperty: true },
        { name: 'params', changeHandler: 'processChange' },
        'attribute'
    ]
};

function configure(config) {
    config
        .singleton(RouteLoader, TemplatingRouteLoader)
        .singleton(Router, AppRouter)
        .globalResources(RouterView, RouteHref);
    config.container.registerAlias(Router, AppRouter);
}

export { RouteHref, RouterView, RouterViewLocator, TemplatingRouteLoader, configure };
//# sourceMappingURL=aurelia-templating-router.js.map
