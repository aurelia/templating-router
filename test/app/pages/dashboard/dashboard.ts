import { inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { ILifeCyclesAssertions, invokeAssertions } from '../../utilities';

@inject(Element, 'pages/dashboard/dashboard')
export class Dashboard {

  router: Router;

  constructor(
    public element: Element,
    public lifecycleCallbacks: ILifeCyclesAssertions
  ) {
    invokeAssertions(this, 'construct');
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: 'home', name: 'home-route', moduleId: 'pages/home/home' },
      { route: 'contacts', name: 'contacts-route', moduleId: 'pages/contacts/contacts' }
    ]);
    config.mapUnknownRoutes({ route: '*', redirect: 'home-route' });
    this.router = router;
    invokeAssertions(this, 'configureRouter');
  }
}
