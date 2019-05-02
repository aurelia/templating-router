'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var aureliaRouter = require('aurelia-router');
var aureliaMetadata = require('aurelia-metadata');
var aureliaPath = require('aurelia-path');
var aureliaTemplating = require('aurelia-templating');
var aureliaDependencyInjection = require('aurelia-dependency-injection');
var aureliaBinding = require('aurelia-binding');
var aureliaPal = require('aurelia-pal');
var LogManager = require('aurelia-logging');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var EmptyLayoutViewModel = /** @class */ (function () {
    function EmptyLayoutViewModel() {
    }
    return EmptyLayoutViewModel;
}());
/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
var RouterView = /** @class */ (function () {
    function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
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
    RouterView.inject = function () {
        return [aureliaPal.DOM.Element, aureliaDependencyInjection.Container, aureliaTemplating.ViewSlot, aureliaRouter.Router, aureliaTemplating.ViewLocator, aureliaTemplating.CompositionTransaction, aureliaTemplating.CompositionEngine];
    };
    RouterView.prototype.created = function (owningView) {
        this.owningView = owningView;
    };
    RouterView.prototype.bind = function (bindingContext, overrideContext) {
        // router needs to get access to view model of current route parent
        // doing it in generic way via viewModel property on container
        this.container.viewModel = bindingContext;
        this.overrideContext = overrideContext;
    };
    /**
     * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
     */
    RouterView.prototype.process = function ($viewPortInstruction, waitToSwap) {
        var _this = this;
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        var viewPortInstruction = $viewPortInstruction;
        var component = viewPortInstruction.component;
        var childContainer = component.childContainer;
        var viewModel = component.viewModel;
        var viewModelResource = component.viewModelResource;
        var metadata = viewModelResource.metadata;
        var config = component.router.currentInstruction.config;
        var viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
        childContainer.get(RouterViewLocator)._notify(this);
        // layoutInstruction is our layout viewModel
        var layoutInstruction = {
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
        var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
        if (viewStrategy && component.view) {
            viewStrategy.makeRelativeTo(aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
        }
        // using metadata of a custom element view model to load appropriate view-factory instance
        return metadata
            .load(childContainer, viewModelResource.value, null, viewStrategy, true)
            // for custom element, viewFactory typing is always ViewFactory
            // for custom attribute, it will be HtmlBehaviorResource
            .then(function (viewFactory) {
            // if this is not the first time that this <router-view/> is composing its instruction
            // try to capture ownership of the composition transaction
            // child <router-view/> will not be able to capture, since root <router-view/> typically captures
            // the ownership token
            if (!_this.compositionTransactionNotifier) {
                _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
            }
            if (layoutInstruction.viewModel || layoutInstruction.view) {
                viewPortInstruction.layoutInstruction = layoutInstruction;
            }
            var viewPortComponentBehaviorInstruction = aureliaTemplating.BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory);
            viewPortInstruction.controller = metadata.create(childContainer, viewPortComponentBehaviorInstruction);
            if (waitToSwap) {
                return null;
            }
            _this.swap(viewPortInstruction);
        });
    };
    RouterView.prototype.swap = function ($viewPortInstruction) {
        var _this = this;
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        var viewPortInstruction = $viewPortInstruction;
        var viewPortController = viewPortInstruction.controller;
        var layoutInstruction = viewPortInstruction.layoutInstruction;
        var previousView = this.view;
        // Final step of swapping a <router-view/> ViewPortComponent
        var work = function () {
            var swapStrategy = aureliaTemplating.SwapStrategies[_this.swapOrder] || aureliaTemplating.SwapStrategies.after;
            var viewSlot = _this.viewSlot;
            swapStrategy(viewSlot, previousView, function () { return Promise.resolve(viewSlot.add(_this.view)); }).then(function () {
                _this._notify();
            });
        };
        // Ensure all users setups have been completed
        var ready = function (owningView_or_layoutView) {
            viewPortController.automate(_this.overrideContext, owningView_or_layoutView);
            var transactionOwnerShipToken = _this.compositionTransactionOwnershipToken;
            // if this router-view is the root <router-view/> of a normal startup via aurelia.setRoot
            // attemp to take control of the transaction
            // if ownership can be taken
            // wait for transaction to complete before swapping
            if (transactionOwnerShipToken) {
                return transactionOwnerShipToken
                    .waitForCompositionComplete()
                    .then(function () {
                    _this.compositionTransactionOwnershipToken = null;
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
                .then(function (layoutController) {
                var layoutView = layoutController.view;
                aureliaTemplating.ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                // when there is a layout
                // view hierarchy is: <router-view/> owner view -> layout view -> ViewPortComponent view
                layoutController.automate(aureliaBinding.createOverrideContext(layoutInstruction.viewModel), _this.owningView);
                layoutView.children.push(viewPortController.view);
                return layoutView || layoutController;
            })
                .then(function (newView) {
                _this.view = newView;
                return ready(newView);
            });
        }
        // if there is no layout, then get ViewPortComponent view ready as view property
        // and process controller/swapping
        // when there is no layout
        // view hierarchy is: <router-view/> owner view -> ViewPortComponent view
        this.view = viewPortController.view;
        return ready(this.owningView);
    };
    /**
     * Notify composition transaction that this router has finished processing
     * Happens when this <router-view/> is the root router-view
     * @internal
     */
    RouterView.prototype._notify = function () {
        var notifier = this.compositionTransactionNotifier;
        if (notifier) {
            notifier.done();
            this.compositionTransactionNotifier = null;
        }
    };
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
    return RouterView;
}());
/**
* Locator which finds the nearest RouterView, relative to the current dependency injection container.
*/
var RouterViewLocator = /** @class */ (function () {
    /**
    * Creates an instance of the RouterViewLocator class.
    */
    function RouterViewLocator() {
        var _this = this;
        this.promise = new Promise(function (resolve) { return _this.resolve = resolve; });
    }
    /**
    * Finds the nearest RouterView instance.
    * @returns A promise that will be resolved with the located RouterView instance.
    */
    RouterViewLocator.prototype.findNearest = function () {
        return this.promise;
    };
    /**@internal */
    RouterViewLocator.prototype._notify = function (routerView) {
        this.resolve(routerView);
    };
    return RouterViewLocator;
}());

/**@internal exported for unit testing */
var EmptyClass = /** @class */ (function () {
    function EmptyClass() {
    }
    return EmptyClass;
}());
aureliaTemplating.inlineView('<template></template>')(EmptyClass);
/**
 * Default implementation of `RouteLoader` used for loading component based on a route config
 */
var TemplatingRouteLoader = /** @class */ (function (_super) {
    __extends(TemplatingRouteLoader, _super);
    function TemplatingRouteLoader(compositionEngine) {
        var _this = _super.call(this) || this;
        _this.compositionEngine = compositionEngine;
        return _this;
    }
    /**
     * Resolve a view model from a RouteConfig
     * Throws when there is neither "moduleId" nor "viewModel" property
     * @internal
     */
    TemplatingRouteLoader.prototype.resolveViewModel = function (router, config) {
        return new Promise(function (resolve, reject) {
            var viewModel;
            if ('moduleId' in config) {
                var moduleId = config.moduleId;
                if (moduleId === null) {
                    viewModel = EmptyClass;
                }
                else {
                    // this requires container of router has passes a certain point
                    // where a view model has been setup on the container
                    // it will fail in enhance scenario because no viewport has been registered
                    moduleId = aureliaPath.relativeToFile(moduleId, aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId);
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
    };
    /**
     * Create child container based on a router container
     * Also ensures that child router are properly constructed in the newly created child container
     * @internal
     */
    TemplatingRouteLoader.prototype.createChildContainer = function (router) {
        var childContainer = router.container.createChild();
        childContainer.registerSingleton(RouterViewLocator);
        childContainer.getChildRouter = function () {
            var childRouter;
            childContainer.registerHandler(aureliaRouter.Router, function () { return childRouter || (childRouter = router.createChild(childContainer)); });
            return childContainer.get(aureliaRouter.Router);
        };
        return childContainer;
    };
    /**
     * Load corresponding component of a route config of a navigation instruction
     */
    TemplatingRouteLoader.prototype.loadRoute = function (router, config, _navInstruction) {
        var _this = this;
        return this
            .resolveViewModel(router, config)
            .then(function (viewModel) { return _this.compositionEngine.ensureViewModel({
            viewModel: viewModel,
            childContainer: _this.createChildContainer(router),
            view: config.view || config.viewStrategy,
            router: router
        }); });
    };
    /**@internal */
    TemplatingRouteLoader.inject = [aureliaTemplating.CompositionEngine];
    return TemplatingRouteLoader;
}(aureliaRouter.RouteLoader));
/**@internal exported for unit testing */
function createDynamicClass(moduleId) {
    var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];
    var DynamicClass = /** @class */ (function () {
        function DynamicClass() {
        }
        DynamicClass.prototype.bind = function (bindingContext) {
            this.$parent = bindingContext;
        };
        return DynamicClass;
    }());
    aureliaTemplating.customElement(name)(DynamicClass);
    aureliaTemplating.useView(moduleId)(DynamicClass);
    return DynamicClass;
}

var logger = LogManager.getLogger('route-href');
/**
 * Helper custom attribute to help associate an element with a route by name
 */
var RouteHref = /** @class */ (function () {
    function RouteHref(router, element) {
        this.router = router;
        this.element = element;
        this.attribute = 'href';
    }
    /*@internal */
    RouteHref.inject = function () {
        return [aureliaRouter.Router, aureliaPal.DOM.Element];
    };
    RouteHref.prototype.bind = function () {
        this.isActive = true;
        this.processChange();
    };
    RouteHref.prototype.unbind = function () {
        this.isActive = false;
    };
    RouteHref.prototype.attributeChanged = function (value, previous) {
        if (previous) {
            this.element.removeAttribute(previous);
        }
        return this.processChange();
    };
    RouteHref.prototype.processChange = function () {
        var _this = this;
        return this.router
            .ensureConfigured()
            .then(function () {
            if (!_this.isActive) {
                // returning null to avoid Bluebird warning
                return null;
            }
            var element = _this.element;
            var href = _this.router.generate(_this.route, _this.params);
            if (element.au.controller) {
                element.au.controller.viewModel[_this.attribute] = href;
            }
            else {
                element.setAttribute(_this.attribute, href);
            }
            // returning null to avoid Bluebird warning
            return null;
        })
            .catch(function (reason) {
            logger.error(reason);
        });
    };
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
    return RouteHref;
}());

function configure(config) {
    config
        .singleton(aureliaRouter.RouteLoader, TemplatingRouteLoader)
        .singleton(aureliaRouter.Router, aureliaRouter.AppRouter)
        .globalResources(RouterView, RouteHref);
    config.container.registerAlias(aureliaRouter.Router, aureliaRouter.AppRouter);
}

exports.RouteHref = RouteHref;
exports.RouterView = RouterView;
exports.TemplatingRouteLoader = TemplatingRouteLoader;
exports.configure = configure;
//# sourceMappingURL=aurelia-templating-router.js.map
