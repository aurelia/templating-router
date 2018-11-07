import { customElement } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

@customElement('dashboard')
export class Dashboard {

  router: Router;

  constructor() {

  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: 'home', name: 'home-route', moduleId: 'pages/home/home' },
      { route: 'contacts', name: 'contacts-route', moduleId: 'pages/contacts/contacts' }
    ]);
    config.mapUnknownRoutes({ route: '*', redirect: 'home-route' });
    this.router = router;
  }
}
