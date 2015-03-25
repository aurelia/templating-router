"use strict";

var _aureliaRouter = require("aurelia-router");

var Router = _aureliaRouter.Router;
var AppRouter = _aureliaRouter.AppRouter;
var RouteLoader = _aureliaRouter.RouteLoader;

var TemplatingRouteLoader = require("./route-loader").TemplatingRouteLoader;

var RouterView = require("./router-view").RouterView;

function install(aurelia) {
  aurelia.withSingleton(RouteLoader, TemplatingRouteLoader).withSingleton(Router, AppRouter).globalizeResources("./router-view");
}

exports.TemplatingRouteLoader = TemplatingRouteLoader;
exports.RouterView = RouterView;
exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});