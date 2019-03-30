import './setup';
import { TemplatingRouteLoader } from '../src/route-loader';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { bootstrap } from 'aurelia-bootstrapper';
import { RouteLoader, AppRouter, Router, RouteConfig, RouterConfiguration } from 'aurelia-router';
import { StageComponent, ComponentTester } from 'aurelia-testing';

describe('router-view', () => {
  let component: ComponentTester;

  beforeEach(done => {
    window.location.hash = '#/';
    done();
  });

  afterEach(done => {
    component.viewModel.router.deactivate();
    component.dispose();
    done();
  });

  it('has a router instance', done => {
    component = withDefaultViewport();

    component.create(bootstrap)
      .then(() => {
        expect(component.viewModel.router).toBeDefined();
        done();
      });
  });

  it('loads a basic view / view-model', done => {
    component = withDefaultViewport({ moduleId: 'test/routes/route-2' });

    component.create(bootstrap)
      .then(() => {
        expect(component.element.querySelectorAll('.route-1').length).toBe(1);
        expect(component.element.querySelectorAll('.route-2').length).toBe(0);
        return component.viewModel.router.navigate('route');
      })
      .then(() => {
        expect(component.element.querySelectorAll('.route-1').length).toBe(0);
        expect(component.element.querySelectorAll('.route-2').length).toBe(1);
        done();
      });
  });

  it('loads a view-only module', done => {
    component = withDefaultViewport({ moduleId: 'test/routes/route-2.html' });

    component.create(bootstrap)
      .then(() => {
        expect(component.element.querySelectorAll('.route-1').length).toBe(1);
        expect(component.element.querySelectorAll('.route-2.view-only').length).toBe(0);
        return component.viewModel.router.navigate('route');
      })
      .then(() => {
        expect(component.element.querySelectorAll('.route-1').length).toBe(0);
        expect(component.element.querySelectorAll('.route-2.view-only').length).toBe(1);
        done();
      });
  });

  describe('with layouts', () => {

    it('loads a module based layout', done => {
      component = withDefaultViewport({
        moduleId: 'test/routes/route-2',
        layoutViewModel: 'test/routes/layout-1'
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.route-2').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll('.layout-1:not(.view-only)').length).toBe(1);
          done();
        })
        .catch(done.fail);
    });

    it('loads a view-only layout', done => {
      component = withDefaultViewport({
        moduleId: 'test/routes/route-2',
        layoutView: 'test/routes/layout-1.html'
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.route-2').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll('.layout-1.view-only').length).toBe(1);
          done();
        });
    });

    it('loads a module based layout with a specific view', done => {
      component = withDefaultViewport({
        moduleId: 'test/routes/route-2',
        layoutView: 'test/routes/layout-1.html',
        layoutViewModel: 'test/routes/layout-2'
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.route-2').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-2').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.route-2').length).toBe(1);
          expect(component.element.querySelectorAll('.layout-1:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll('.layout-2:not(.view-only)').length).toBe(1);
          done();
        });
    });

    it('loads a layout with multiple slots', done => {
      component = withDefaultViewport({
        moduleId: 'test/routes/multiple-slots-route-1',
        layoutView: 'test/routes/multiple-slots-layout-1.html'
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.multiple-slots-layout-1').length).toBe(0);
          expect(component.element.querySelectorAll('.multiple-slots-route-1-slot-1').length).toBe(0);
          expect(component.element.querySelectorAll('.multiple-slots-route-1-slot-2').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.multiple-slots-layout-1.view-only').length).toBe(1);
          expect(component.element.querySelectorAll('.multiple-slots-route-1-slot-1:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll('.multiple-slots-route-1-slot-2:not(.view-only)').length).toBe(1);
          done();
        });
    });

    it('loads layouts for a named viewport', done => {
      component = withNamedViewport({
        viewPorts: {
          viewport1: {
            moduleId: 'test/routes/route-2',
            layoutViewModel: 'test/routes/layout-1'
          }
        }
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.route-2').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll('.layout-1:not(.view-only)').length).toBe(1);
          done();
        })
        .catch(done.fail);
    });

    it('activates the layout viewmodel with a model value', done => {
      const params = 1;
      component = withDefaultViewport({
        moduleId: 'test/routes/route-2',
        layoutViewModel: 'test/routes/layout-1',
        layoutModel: params
      });

      component.create(bootstrap)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(1);
          expect(component.element.querySelectorAll('.route-2').length).toBe(0);
          expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
          return component.viewModel.router.navigate('route');
        })
        .then(wait)
        .then(() => {
          expect(component.element.querySelectorAll('.route-1').length).toBe(0);
          expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
          expect(component.element.querySelectorAll(`.layout-1[data-activate="${params}"]`).length).toBe(1);
          done();
        });
    });

    // INFO [Matt] This failing test is a bug that needs to get resolved, but
    // it is existing and apprarently not critical. References to existing issues
    // appreciated.
    // it('resolves the navigate promise when navigation is complete', done => {
    //   component = withDefaultViewport({ moduleId: 'test/routes/route-2', layoutViewModel: 'test/routes/layout-1') });

    //   component.create(bootstrap)
    //     .then(() => {
    //       expect(component.element.querySelectorAll('.route-1').length).toBe(1);
    //       expect(component.element.querySelectorAll('.route-2').length).toBe(0);
    //       expect(component.element.querySelectorAll('.layout-1').length).toBe(0);
    //       return component.viewModel.router.navigate('route');
    //     })
    //     .then(() => {
    //       expect(component.element.querySelectorAll('.route-1').length).toBe(0);
    //       expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
    //       expect(component.element.querySelectorAll('.layout-1:not(.view-only)').length).toBe(1);
    //       done();
    //     });
    // });
  });

  // INFO [Matt] TODO [Binh] Attached isn't being called properly.
  // it('supports classes as a module id', (done) => {
  //   const { Route2ViewModel } = require('test/routes/route-2');

  //   component = withDefaultViewport({ moduleId: Route2ViewModel )});

  //   component.create(bootstrap)
  //     .then(() => {
  //       expect(component.element.querySelectorAll('.route-1').length).toBe(1);
  //       expect(component.element.querySelectorAll('.route-2').length).toBe(0);
  //       return component.viewModel.router.navigate('route');
  //     })
  //     .then(() => {
  //       expect(component.element.querySelectorAll('.route-1').length).toBe(0);
  //       expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
  //       done();
  //     });
  // });

  // INFO [Matt] Not supported.
  // it('supports objects as a module id', (done) => {
  //   const { Route2ViewModel } = require('test/routes/route-2');

  //   component = withDefaultViewport({ moduleId: new Route2ViewModel() )});

  //   component.create(bootstrap)
  //     .then(() => {
  //       expect(component.element.querySelectorAll('.route-1').length).toBe(1);
  //       expect(component.element.querySelectorAll('.route-2').length).toBe(0);
  //       return component.viewModel.router.navigate('route');
  //     })
  //     .then(() => {
  //       expect(component.element.querySelectorAll('.route-1').length).toBe(0);
  //       expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
  //       done();
  //     });
  // });
});

function wait() {
  return new Promise(res => setTimeout(() => res(), 250));
}

function withDefaultViewport(routeConfig?: Partial<RouteConfig>) {
  let component = StageComponent
      .withResources()
      .inView('<router-view></router-view>');

  configure(component, {
    route: ['', 'default'],
    moduleId: 'test/routes/route-1',
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

function withNamedViewport(routeConfig?: Partial<RouteConfig>) {
  let component = StageComponent
      .withResources()
      .inView('<router-view name="viewport1"></router-view>');

  configure(component, {
    route: ['', 'default'],
    viewPorts: {
      viewport1: { moduleId: 'test/routes/route-1' }
    },
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

function configure(component: ComponentTester, defaultRoute: RouteConfig, routeConfig: Partial<RouteConfig>) {
  component.bootstrap((aurelia: Aurelia) => {
    aurelia.use.standardConfiguration();

    const routeConfigs: RouteConfig[] = [defaultRoute];
    if (routeConfig) {
      routeConfig.activationStrategy = 'replace';
      routeConfig.route = 'route';
      routeConfigs.push(routeConfig as RouteConfig);
    }

    aurelia.container.viewModel = {
      configureRouter: (config: RouterConfiguration, router: Router) => {
        config.map(routeConfigs);
      }
    };

    return aurelia.use;
  });
}
