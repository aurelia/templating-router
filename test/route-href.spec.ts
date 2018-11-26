import './setup';
import { TemplatingRouteLoader } from '../src/route-loader';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { bootstrap } from 'aurelia-bootstrapper';
import { RouteLoader, AppRouter, Router, RouterConfiguration } from 'aurelia-router';
import { StageComponent, ComponentTester } from 'aurelia-testing';

describe('route-href', () => {
  let component: ComponentTester;

  afterEach(done => {
    component.dispose();
    done();
  });

  it('should use route as primary property', done => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('src/route-href'))
      .inView('<a route-href.bind="name"></a>')
      .boundTo({ name: 'b' });

    configure(component);

    component.create(bootstrap)
      .then(() => {
        expect(component.viewModel.route).toBe('b');
        done();
      });
  });
});

function configure(component: ComponentTester) {
  component.bootstrap((aurelia: Aurelia) => {
    aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .history();

    aurelia.use
      .singleton(RouteLoader, TemplatingRouteLoader)
      .singleton(Router, AppRouter);

    aurelia.use.container.viewModel = {
      configureRouter: (config: RouterConfiguration, router: Router) => {
        config.map([
          { route: 'a', name: 'a' },
          { route: 'b', name: 'b' }
        ]);
      }
    };
    return aurelia.use;
  });
}
