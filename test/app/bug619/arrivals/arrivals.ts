import { PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

export class Arrivals {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;

    config.map([
      {
        name: 'arrival',
        route: ['', 'arrival'],
        href: '#/arrivals/arrival',
        moduleId: PLATFORM.moduleName('../arrival/arrival'),
        nav: true,
        title: 'Arrival'
      },
      {
        name: 'products',
        route: 'products/:index?',
        href: `#/arrivals/products`,
        moduleId: PLATFORM.moduleName('../products/products'),
        nav: true,
        title: 'Products',
        activationStrategy: 'replace'
      }
    ]);
  }
}
