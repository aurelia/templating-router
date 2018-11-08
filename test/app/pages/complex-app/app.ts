import { RouterConfiguration, RouteConfig, Router } from 'aurelia-router';
import { ITestRoutingComponent, IRouteConfigs, ILifeCyclesAssertions, invokeAssertions } from '../../utilities';
import { CompositionTransaction, View, inject } from 'aurelia-framework';

@inject(Element, CompositionTransaction, IRouteConfigs, 'pages/complex-app/app')
export class App {
  router: Router;

  lifecycleCallbacks: ILifeCyclesAssertions;

  view: View;

  constructor(
    private element: Element,
    private compositionTransaction: CompositionTransaction,
    private routeConfigs: RouteConfig[],
    lifecycleCallbacks: ILifeCyclesAssertions
  ) {
    this.lifecycleCallbacks = lifecycleCallbacks;
    invokeAssertions(this, 'construct');
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map(this.routeConfigs);
    this.router = router;
    invokeAssertions(this, 'configureRouter');
  }

  created(_: any, view: View) {
    this.view = view;
    invokeAssertions(this, 'created');
  }

  bind() {
    invokeAssertions(this, 'bind');
  }

  attached() {
    invokeAssertions(this, 'attached');
  }
}
