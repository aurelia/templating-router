import { bootstrap } from 'aurelia-bootstrapper';
import { LogManager } from 'aurelia-framework';
import { logLevel } from 'aurelia-logging';
import { ConsoleAppender } from 'aurelia-logging-console';
import { RouteConfig, Router, RouterConfiguration } from 'aurelia-router';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { RouterView } from '../../src/router-view';
import './shared';
import { verifyElementsCount, wait } from './utilities';

describe('<router-view/>', () => {
  let component: ComponentTester<RouterView>;

  beforeAll(() => {
    addDebugLogging();
  });

  beforeEach(async () => {
    component = undefined;
    window.location.hash = '#/';
    await Promise.resolve();
  });

  afterEach(async () => {
    if (component) {
      (component.viewModel.router as any).deactivate();
      component.dispose();
    }
    await Promise.resolve();
  });

  describe('Basic integration', function _1_basic_integration__Tests() {

    it('has a router instance', async () => {
      component = withDefaultViewport();
      await component.create(bootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      expect(component.viewModel.router).toBeDefined();
    });

    it('loads a basic view / view-model', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2'
      } as RouteConfig);

      await component.create(bootstrap);

      expect(component.element.querySelectorAll('.route-1').length).toBe(1);
      expect(component.element.querySelectorAll('.route-2').length).toBe(0);

      await component.viewModel.router.navigate('route');

      expect(component.element.querySelectorAll('.route-1').length).toBe(0);
      expect(component.element.querySelectorAll('.route-2').length).toBe(1);
    });

    it('loads a view-only module', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2.html'
      } as RouteConfig);

      await component.create(bootstrap);
      verifyElementsCount(component, '.route-1', 1);
      verifyElementsCount(component, '.route-2.view-only', 0);
      // expect(component.element.querySelectorAll('.route-1').length).toBe(1);
      // expect(component.element.querySelectorAll('.route-2.view-only').length).toBe(0);

      await component.viewModel.router.navigate('route');

      expect(component.element.querySelectorAll('.route-1').length).toBe(0);
      expect(component.element.querySelectorAll('.route-2.view-only').length).toBe(1);
    });
  });

  describe('with layouts', () => {

    it('loads a module based layout', done => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutViewModel: 'routes/layout-1'
      } as RouteConfig);

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
        moduleId: 'routes/route-2',
        layoutView: 'routes/layout-1.html'
      } as RouteConfig);

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
        })
        .catch(done.fail);
    });

    it('loads a module based layout with a specific view', done => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutView: 'routes/layout-1.html',
        layoutViewModel: 'routes/layout-2'
      } as RouteConfig);

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
        })
        .catch(done.fail);
    });

    it('loads a layout with multiple slots', done => {
      component = withDefaultViewport({
        moduleId: 'routes/multiple-slots-route-1',
        layoutView: 'routes/multiple-slots-layout-1.html'
      } as RouteConfig);

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
        })
        .catch(done.fail);
    });

    it('loads layouts for a named viewport', done => {
      component = withNamedViewport({
        viewPorts: {
          viewport1: {
            moduleId: 'routes/route-2',
            layoutViewModel: 'routes/layout-1'
          }
        }
      } as RouteConfig);

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
        moduleId: 'routes/route-2',
        layoutViewModel: 'routes/layout-1',
        layoutModel: params
      } as RouteConfig);

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
        })
        .catch(done.fail);
    });

    // INFO [Matt] This failing test is a bug that needs to get resolved, but
    // it is existing and apprarently not critical. References to existing issues
    // appreciated.
    // it('resolves the navigate promise when navigation is complete', done => {
    //   component = withDefaultViewport({ moduleId: 'test/routes/route-2', layoutViewModel: 'test/routes/layout-1' });

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

  //   component = withDefaultViewport({ moduleId: Route2ViewModel });

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

  //   component = withDefaultViewport({ moduleId: new Route2ViewModel() });

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

function withDefaultViewport(routeConfig?: RouteConfig) {
  let component = StageComponent
    .withResources()
    .inView('<router-view></router-view>');

  configureComponent(component, {
    route: ['', 'default'],
    moduleId: './routes/route-1',
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

function withNamedViewport(routeConfig: RouteConfig) {
  let component = StageComponent
    .withResources()
    .inView('<router-view name="viewport1"></router-view>');

  configureComponent(component, {
    route: ['', 'default'],
    viewPorts: {
      viewport1: { moduleId: './routes/route-1' }
    },
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

function configureComponent(
  component: ComponentTester,
  defaultRoute: RouteConfig,
  routeConfig: RouteConfig
) {
  component.bootstrap(aurelia => {
    aurelia.use.standardConfiguration();

    // aurelia.use
    //   .singleton(RouteLoader, TemplatingRouteLoader)
    //   .singleton(Router, AppRouter)
    //   .globalResources([
    //     RouterView,
    //     RouteHref
    //   ]);


    let configs: RouteConfig[];

    if (routeConfig) {
      routeConfig.activationStrategy = 'replace';
      routeConfig.route = 'route';
      configs = [defaultRoute, routeConfig];
    } else {
      configs = [defaultRoute];
    }

    aurelia.use.container.viewModel = {
      configureRouter: (config: RouterConfiguration, router: Router) => {
        config.map(configs);
      }
    };

    return aurelia.use;
  });
}

function addDebugLogging() {
  const appenders = LogManager.getAppenders();
  if (!appenders || !appenders.length) {
    LogManager.setLevel(logLevel.error);
    LogManager.addAppender(new ConsoleAppender());
  }
}

function removeDebugLogging() {
  LogManager.clearAppenders();
}
