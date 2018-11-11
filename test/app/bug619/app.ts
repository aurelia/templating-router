import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-framework';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        name: 'home',
        route: ['', 'home'],
        moduleId: PLATFORM.moduleName('./home/home'),
        nav: true,
        title: 'Home'
      },
      {
        name: 'arrivals',
        route: 'arrivals',
        href: '#/arrivals',
        moduleId: PLATFORM.moduleName('./arrivals/arrivals'),
        nav: true,
        title: 'Arrivals'
      },
      {
        name: 'products',
        route: 'products',
        href: '#/products',
        redirect: 'arrivals/products',
        nav: true,
        title: 'Products'
      }
    ]);
  }
}
