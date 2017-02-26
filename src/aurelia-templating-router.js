import {PLATFORM} from 'aurelia-pal';
import {Router, AppRouter, RouteLoader} from 'aurelia-router';
import {TemplatingRouteLoader} from './route-loader';
import {RouterView} from './router-view';
import {RouteHref} from './route-href';

function configure(config) {
  config
    .singleton(RouteLoader, TemplatingRouteLoader)
    .singleton(Router, AppRouter)
    .globalResources(
      PLATFORM.moduleName('./router-view'),
      PLATFORM.moduleName('./route-href')
    );

  config.container.registerAlias(Router, AppRouter);
}

export {
  TemplatingRouteLoader,
  RouterView,
  RouteHref,
  configure
};
