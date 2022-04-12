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

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var LogManager__namespace = /*#__PURE__*/_interopNamespace(LogManager);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var EmptyLayoutViewModel = (function () {
    function EmptyLayoutViewModel() {
    }
    return EmptyLayoutViewModel;
}());
var RouterView = (function () {
    function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
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
    RouterView.inject = function () {
        return [aureliaPal.DOM.Element, aureliaDependencyInjection.Container, aureliaTemplating.ViewSlot, aureliaRouter.Router, aureliaTemplating.ViewLocator, aureliaTemplating.CompositionTransaction, aureliaTemplating.CompositionEngine];
    };
    RouterView.prototype.created = function (owningView) {
        this.owningView = owningView;
    };
    RouterView.prototype.bind = function (bindingContext, overrideContext) {
        this.container.viewModel = bindingContext;
        this.overrideContext = overrideContext;
    };
    RouterView.prototype.process = function ($viewPortInstruction, waitToSwap) {
        var _this = this;
        var viewPortInstruction = $viewPortInstruction;
        var component = viewPortInstruction.component;
        var childContainer = component.childContainer;
        var viewModel = component.viewModel;
        var viewModelResource = component.viewModelResource;
        var metadata = viewModelResource.metadata;
        var config = component.router.currentInstruction.config;
        var viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
        childContainer.get(RouterViewLocator)._notify(this);
        var layoutInstruction = {
            viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
            view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
            model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
            router: viewPortInstruction.component.router,
            childContainer: childContainer,
            viewSlot: this.viewSlot
        };
        var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
        if (viewStrategy && component.view) {
            viewStrategy.makeRelativeTo(aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
        }
        return metadata
            .load(childContainer, viewModelResource.value, null, viewStrategy, true)
            .then(function (viewFactory) {
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
        var viewPortInstruction = $viewPortInstruction;
        var viewPortController = viewPortInstruction.controller;
        var layoutInstruction = viewPortInstruction.layoutInstruction;
        var previousView = this.view;
        var work = function () {
            var swapStrategy = aureliaTemplating.SwapStrategies[_this.swapOrder] || aureliaTemplating.SwapStrategies.after;
            var viewSlot = _this.viewSlot;
            swapStrategy(viewSlot, previousView, function () { return Promise.resolve(viewSlot.add(_this.view)); }).then(function () {
                _this._notify();
            });
        };
        var ready = function (owningView_or_layoutView) {
            viewPortController.automate(_this.overrideContext, owningView_or_layoutView);
            var transactionOwnerShipToken = _this.compositionTransactionOwnershipToken;
            if (transactionOwnerShipToken) {
                return transactionOwnerShipToken
                    .waitForCompositionComplete()
                    .then(function () {
                    _this.compositionTransactionOwnershipToken = null;
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
                .then(function (layoutController) {
                var layoutView = layoutController.view;
                aureliaTemplating.ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                layoutController.automate(aureliaBinding.createOverrideContext(layoutInstruction.viewModel), _this.owningView);
                layoutView.children.push(viewPortController.view);
                return layoutView || layoutController;
            })
                .then(function (newView) {
                _this.view = newView;
                return ready(newView);
            });
        }
        this.view = viewPortController.view;
        return ready(this.owningView);
    };
    RouterView.prototype._notify = function () {
        var notifier = this.compositionTransactionNotifier;
        if (notifier) {
            notifier.done();
            this.compositionTransactionNotifier = null;
        }
    };
    RouterView.$view = null;
    RouterView.$resource = {
        name: 'router-view',
        bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context']
    };
    return RouterView;
}());
var RouterViewLocator = (function () {
    function RouterViewLocator() {
        var _this = this;
        this.promise = new Promise(function (resolve) { return _this.resolve = resolve; });
    }
    RouterViewLocator.prototype.findNearest = function () {
        return this.promise;
    };
    RouterViewLocator.prototype._notify = function (routerView) {
        this.resolve(routerView);
    };
    return RouterViewLocator;
}());

var EmptyClass = (function () {
    function EmptyClass() {
    }
    return EmptyClass;
}());
aureliaTemplating.inlineView('<template></template>')(EmptyClass);
var TemplatingRouteLoader = (function (_super) {
    __extends(TemplatingRouteLoader, _super);
    function TemplatingRouteLoader(compositionEngine) {
        var _this = _super.call(this) || this;
        _this.compositionEngine = compositionEngine;
        return _this;
    }
    TemplatingRouteLoader.prototype.resolveViewModel = function (router, config) {
        return new Promise(function (resolve, reject) {
            var viewModel;
            if ('moduleId' in config) {
                var moduleId = config.moduleId;
                if (moduleId === null) {
                    viewModel = EmptyClass;
                }
                else {
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
            reject(new Error('Invalid route config. No "moduleId" found.'));
        });
    };
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
    TemplatingRouteLoader.prototype.loadRoute = function (router, config, navInstruction) {
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
    TemplatingRouteLoader.inject = [aureliaTemplating.CompositionEngine];
    return TemplatingRouteLoader;
}(aureliaRouter.RouteLoader));
function createDynamicClass(moduleId) {
    var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];
    var DynamicClass = (function () {
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

var logger = LogManager__namespace.getLogger('route-href');
var RouteHref = (function () {
    function RouteHref(router, element) {
        this.router = router;
        this.element = element;
        this.attribute = 'href';
    }
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
            return null;
        })
            .catch(function (reason) {
            logger.error(reason);
        });
    };
    RouteHref.$resource = {
        type: 'attribute',
        name: 'route-href',
        bindables: [
            { name: 'route', changeHandler: 'processChange', primaryProperty: true },
            { name: 'params', changeHandler: 'processChange' },
            'attribute'
        ]
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
exports.RouterViewLocator = RouterViewLocator;
exports.TemplatingRouteLoader = TemplatingRouteLoader;
exports.configure = configure;
//# sourceMappingURL=aurelia-templating-router.js.map
