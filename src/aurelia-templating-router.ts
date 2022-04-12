import { Router, AppRouter, RouteLoader } from 'aurelia-router';
import { TemplatingRouteLoader } from './route-loader';
import { RouterView, RouterViewLocator } from './router-view';
import { RouteHref } from './route-href';
import { IFrameworkConfiguration } from './interfaces';

export function configure(config: IFrameworkConfiguration) {
  config
    .singleton(RouteLoader, TemplatingRouteLoader)
    .singleton(Router, AppRouter)
    .globalResources(
      RouterView,
      RouteHref
    );

  config.container.registerAlias(Router, AppRouter);
}

export {
  TemplatingRouteLoader,
  RouterView,
  RouterViewLocator,
  RouteHref
};
