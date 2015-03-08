import {Router, AppRouter, RouteLoader} from 'aurelia-router';
import {TemplatingRouteLoader} from './route-loader';
import {RouterView} from './router-view';

function install(aurelia){
  aurelia.withSingleton(RouteLoader, TemplatingRouteLoader)
         .withSingleton(Router, AppRouter)
         .globalizeResources('./router-view');
}

export {
  TemplatingRouteLoader,
  RouterView,
  install
};
