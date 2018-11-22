import { RouterConfiguration, Router, RouteConfig, NavigationInstruction } from 'aurelia-router';
import { inject, CompositionTransaction, View } from 'aurelia-framework';
import { IRouteConfigs, ILifeCyclesAssertions, ILifeCyclesCallbacks, invokeAssertions } from '../../utilities';

@inject(Element, CompositionTransaction, IRouteConfigs, 'pages/swap-order-app/app')
export class SwapOrderApp {
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

  created(_: any, view: View) {
    this.view = view;
    return invokeAssertions(this, 'created');
  }

  bind() {
    return invokeAssertions(this, 'bind');
  }

  attached() {
    return invokeAssertions(this, 'attached');
  }
}
