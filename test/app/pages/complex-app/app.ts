import { RouterConfiguration, RouteConfig, Router, NavigationInstruction } from 'aurelia-router';
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

  configureRouter(config: RouterConfiguration, router: Router, navInstruction: NavigationInstruction) {
    config.map(this.routeConfigs);
    this.router = router;
    return invokeAssertions(this, 'configureRouter', config, router, navInstruction);
  }

  created(_: View, view: View) {
    this.view = view;
    invokeAssertions(this, 'created', _, view);
  }

  bind() {
    invokeAssertions(this, 'bind');
  }

  attached() {
    invokeAssertions(this, 'attached');
  }
}
