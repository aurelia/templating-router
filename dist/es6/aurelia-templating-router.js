import {Router, AppRouter, RouteLoader} from 'aurelia-router';
import {TemplatingRouteLoader} from './route-loader';
import {RouterView} from './router-view';
import {RouteHref} from './route-href';

function configure(aurelia){
  aurelia.withSingleton(RouteLoader, TemplatingRouteLoader)
         .withSingleton(Router, AppRouter)
         .globalizeResources('./router-view', './route-href');
}

export {
  TemplatingRouteLoader,
  RouterView,
  RouteHref,
  configure
};
