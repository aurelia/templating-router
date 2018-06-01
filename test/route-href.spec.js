import {TemplatingRouteLoader} from 'src/route-loader';
import {bootstrap} from 'aurelia-bootstrapper';
import {RouteLoader, AppRouter, Router} from 'aurelia-router';
import {StageComponent} from 'aurelia-testing';

describe('route-href', () => {
  /**@type {StageComponent} */
  let component;

  afterEach(done => {
    component.dispose();
    done();
  });

  it('should use route as primary property', done => {
    component = StageComponent
      .withResources('src/route-href')
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

function configure(component) {
  component.bootstrap(aurelia => {
    aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .history();

    aurelia.use
      .singleton(RouteLoader, TemplatingRouteLoader)
      .singleton(Router, AppRouter);

    aurelia.use.container.viewModel = {
      configureRouter: (config, router) => {
        config.map([
          { route: 'a', name: 'a' },
          { route: 'b', name: 'b' }
        ]);
      }
    };
  });
}
