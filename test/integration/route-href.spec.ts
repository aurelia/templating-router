import { TemplatingRouteLoader } from '../../src/route-loader';
import { bootstrap } from 'aurelia-bootstrapper';
// import { bootstrap } from './bootstrap';
import { RouteLoader, AppRouter, Router, RouterConfiguration } from 'aurelia-router';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { Aurelia, PLATFORM, LogManager } from 'aurelia-framework';
import './shared';
import { RouteHref } from '../../src';

describe('route-href', () => {
  let component: ComponentTester<RouteHref>;

  afterEach(done => {
    component.dispose();
    done();
  });

  it('should use route as primary property', done => {
    component = StageComponent
      .withResources()
      .inView('<a route-href.bind="name"></a>')
      .boundTo({ name: 'b' });

    configure(component);

    component.create(bootstrap)
      .then(() => {
        expect(component.viewModel.route).toBe('b');
        done();
      })
      .catch(done.fail);
  });
});

function configure(component: ComponentTester) {
  component.bootstrap((aurelia: Aurelia) => {
    aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .history()
      .router();

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
