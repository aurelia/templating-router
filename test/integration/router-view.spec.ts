import '../setup';
import './shared';
import { bootstrap } from 'aurelia-bootstrapper';
import { LogManager, PLATFORM } from 'aurelia-framework';
import { logLevel } from 'aurelia-logging';
import { ConsoleAppender } from 'aurelia-logging-console';
import { RouteConfig, Router, RouterConfiguration, AppRouter } from 'aurelia-router';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { RouterView } from '../../src/router-view';
import { verifyElementsCount, wait } from './utilities';

describe('<router-view/>', () => {
  let component: ComponentTester<RouterView>;

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(() => {
    removeDebugLogging();
  });

  beforeEach(() => {
  });

  afterEach(() => {
    if (component) {
      const appRouter = component.viewModel.router as AppRouter;
      appRouter.reset();
      appRouter.deactivate();
      component.dispose();
      component = undefined;
    }
    window.location.hash = '';
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

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2', 1]
      ]);
    });

    it('loads a view-only module', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2.html'
      } as RouteConfig);

      await component.create(bootstrap);
      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2.view-only', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2.view-only', 1]
      ]);
    });
  });

  describe('with layouts', () => {
    it('loads a module based layout', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutViewModel: 'routes/layout-1'
      });

      await component.create(bootstrap);
      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0],
        ['.layout-1', 0]
      ]);

      // awaiting the navigate invokation directly will make the test fail???
      let wait1 = component.viewModel.router.navigate('route');
      await wait(wait1);
      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2:not(.view-only)', 1],
        ['.layout-1:not(.view-only)', 1]
      ]);
    });

    it('loads a view-only layout', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutView: 'routes/layout-1.html'
      } as RouteConfig);

      await component.create(bootstrap);

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0],
        ['.layout-1', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2:not(.view-only)', 1],
        ['.layout-1.view-only', 1]
      ]);
    });

    it('loads a module based layout with a specific view', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutView: 'routes/layout-1.html',
        layoutViewModel: 'routes/layout-2'
      } as RouteConfig);

      await component.create(bootstrap);

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0],
        ['.layout-1', 0],
        ['.layout-2', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2', 1],
        ['.layout-1:not(.view-only)', 1],
        ['.layout-2:not(.view-only)', 1]
      ]);
    });

    it('loads a layout with multiple slots', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/multiple-slots-route-1',
        layoutView: 'routes/multiple-slots-layout-1.html'
      } as RouteConfig);

      await component.create(bootstrap);

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.multiple-slots-layout-1', 0],
        ['.multiple-slots-route-1-slot-1', 0],
        ['.multiple-slots-route-1-slot-2', 0]
      ]);

      await component.viewModel.router.navigate('route');
      // TODO: figure out why it fails without wait
      await wait(50);

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.multiple-slots-layout-1', 1],
        ['.multiple-slots-route-1-slot-1', 1],
        ['.multiple-slots-route-1-slot-2', 1]
      ]);
    });

    it('loads layouts for a named viewport', async () => {
      component = withNamedViewport({
        viewPorts: {
          viewport1: {
            moduleId: 'routes/route-2',
            layoutViewModel: 'routes/layout-1'
          }
        }
      } as RouteConfig);

      await component.create(bootstrap);

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0],
        ['.layout-1', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2', 1],
        ['.layout-1', 1]
      ]);
    });

    it('activates the layout viewmodel with a model value', async () => {
      const params = 1;
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutViewModel: 'routes/layout-1',
        layoutModel: params
      } as RouteConfig);

      await component.create(bootstrap);

      expect(component.element.querySelectorAll('.route-1').length).toBe(1);
      expect(component.element.querySelectorAll('.route-2').length).toBe(0);
      expect(component.element.querySelectorAll('.layout-1').length).toBe(0);

      await component.viewModel.router.navigate('route');

      expect(component.element.querySelectorAll('.route-1').length).toBe(0);
      expect(component.element.querySelectorAll('.route-2:not(.view-only)').length).toBe(1);
      expect(component.element.querySelectorAll(`.layout-1[data-activate="${params}"]`).length).toBe(1);
    });

    // INFO [Matt] This failing test is a bug that needs to get resolved, but
    // it is existing and apprarently not critical. References to existing issues
    // appreciated.
    // UPDATE [Binh] seems to be fixed
    it('resolves the navigate promise when navigation is complete', async () => {
      component = withDefaultViewport({
        moduleId: 'routes/route-2',
        layoutViewModel: 'routes/layout-1'
      });

      await component.create(bootstrap);

      verifyElementsCount(component, [
        ['.route-1', 1],
        ['.route-2', 0],
        ['.layout-1', 0]
      ]);

      await component.viewModel.router.navigate('route');

      verifyElementsCount(component, [
        ['.route-1', 0],
        ['.route-2:not(.view-only)', 1],
        ['.layout-1:not(.view-only)', 1]
      ]);
    });
  });
});

function withDefaultViewport(routeConfig?: RouteConfig) {
  let component = StageComponent
    .withResources()
    .inView('<router-view></router-view>');

  configureComponent(component, {
    route: ['', 'default'],
    moduleId: 'routes/route-1',
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
      viewport1: { moduleId: 'routes/route-1' }
    },
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

function configureComponent(
  component: ComponentTester,
  defaultRoute: RouteConfig,
  routeConfig?: RouteConfig
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
