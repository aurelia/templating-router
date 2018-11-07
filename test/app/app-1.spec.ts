import './setup';
import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, Controller } from 'aurelia-framework';
import { ConfiguresRouter, RouterConfiguration, Router, RouteConfig, AppRouter } from 'aurelia-router';
import { wait, IConstructable, h, ITestRoutingComponent, verifyElementsCount, IRouteConfigs, ILifeCyclesCallbacks, ILifeCyclesAssertions } from './utilities';

describe('INTEGRATION -- App like', () => {

  let routeConfigs: RouteConfig[];
  let lifecyclesCallbacks: ILifeCyclesAssertions;
  // Helps easily inject lifecycle callbacks into each route dynamically
  // based on their file location structure
  let routeLifeCylceCallbacks: Record<string, ILifeCyclesAssertions>;
  let root: string | IConstructable<ITestRoutingComponent>;
  let host: Element;
  let aurelia: Aurelia;
  let viewModel: ITestRoutingComponent;
  let appRouter: AppRouter;

  beforeEach(() => {
    routeLifeCylceCallbacks = {};
    host = h('div');
  });

  afterEach(() => {
    if (aurelia) {
      const root = (aurelia as any).root as Controller;
      root.unbind();
      root.detached();
      aurelia = undefined;
      appRouter.reset();
      appRouter.deactivate();
    }
    if (host) {
      host.remove();
    }
    location.hash = '';
  });

  describe('static app', () => {

    it('bootstraps a static root app', async () => {
      routeConfigs = [
        { route: ['', 'home'], moduleId: 'pages/home/home' }
      ];
      root = BaseRoutingComponent;
      await bootstrap(configure);
      expect(viewModel instanceof (root as IConstructable<ITestRoutingComponent>)).toBe(true);
      expect(viewModel.router.currentInstruction.fragment).toBe('/');
      verifyElementsCount(viewModel.element, '.home-route', 1);
    });
  });

  describe('dynamic root app', () => {
    it('bootstraps', async () => {
      let lifecycleCount = 0;
      routeConfigs = [
        { route: '', moduleId: 'pages/home/home' }
        // { route: 'dashboard', moduleId: 'pages/dashboard/dashboard' }
      ];
      routeLifeCylceCallbacks = {
        'pages/app/app': {
          created: viewModel => {
            lifecycleCount++;
            verifyElementsCount(viewModel.view.firstChild.parentNode, [
              ['.app', 1],
              ['.home-route', 1]
            ]);
          },
          attached: viewModel => {
            lifecycleCount++;
            verifyElementsCount(viewModel.element, [
              ['.app', 1],
              ['.home-route', 1]
            ]);
          }
        }
      };
      root = 'pages/app/app';
      await bootstrap(configure);
      expect(lifecycleCount).toBe(2);
      expect(viewModel.router.currentInstruction.fragment).toBe('/');
    });

    it('bootstrap with multiple routes', async () => {
      let lifecycleCount = 0;
      routeConfigs = [
        { route: '', moduleId: 'pages/home/home' },
        { route: 'dashboard', moduleId: 'pages/dashboard/dashboard' }
      ];
      routeLifeCylceCallbacks = {
        'pages/app/app': {
          created: viewModel => {
            lifecycleCount++;
            verifyElementsCount(viewModel.view.firstChild.parentNode, [
              ['.app', 1],
              ['.home-route', 1]
            ]);
          },
          attached: viewModel => {
            lifecycleCount++;
            verifyElementsCount(viewModel.element, [
              ['.app', 1],
              ['.home-route', 1]
            ]);
          }
        },
        'pages/home/home': {
          attached: viewModel => {
            lifecycleCount++;
          }
        }
      };
      root = 'pages/app/app';
      await bootstrap(configure);
      expect(lifecycleCount).toBe(3);
      expect(viewModel.router.currentInstruction.fragment).toBe('/');
    });
  });

  async function configure($aurelia: Aurelia): Promise<void> {
    $aurelia
      .use
      .standardConfiguration();

    await $aurelia.start();

    $aurelia.container.registerHandler(IRouteConfigs, () => routeConfigs);
    Object
      .keys(routeLifeCylceCallbacks)
      .forEach(route => $aurelia.container.registerHandler(route, () => routeLifeCylceCallbacks[route]));
    appRouter = $aurelia.container.get(Router);

    await $aurelia.setRoot(root, host);

    viewModel = ($aurelia as any).root.viewModel;

    aurelia = $aurelia;
  }

  class BaseRoutingComponent implements ITestRoutingComponent {

    static $view = '<template><router-view></router-view></template>';
    static inject = [Element, IRouteConfigs];

    element: Element;
    router: Router;
    routeConfigs: RouteConfig[];

    constructor(element: Element, routeConfigs: RouteConfig[]) {
      this.element = element;
      this.routeConfigs = routeConfigs;
    }

    configureRouter(config: RouterConfiguration, router: Router) {
      config.map(this.routeConfigs);
      this.router = router;
    }
  }
});
