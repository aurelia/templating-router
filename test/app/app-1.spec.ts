import './setup';
import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, Controller, PLATFORM } from 'aurelia-framework';
import { ConfiguresRouter, RouterConfiguration, Router, RouteConfig, AppRouter } from 'aurelia-router';
import { wait, IConstructable, h, ITestRoutingComponent, verifyElementsCount, IRouteConfigs, ILifeCyclesAssertions, createEntryConfigure } from './utilities';

describe('INTEGRATION -- App like', () => {

  let routeConfigs: RouteConfig[];
  let lifecyclesCallbacks: ILifeCyclesAssertions;
  // Helps easily inject lifecycle callbacks into each route dynamically
  // based on their file location structure
  let routeLifeCylceCallbacks: Record<string, ILifeCyclesAssertions>;
  let root: string | IConstructable<ITestRoutingComponent>;
  let host: Element;
  let aurelia: Aurelia;
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
      await bootstrap(createEntryConfigure(
        BaseRoutingComponent,
        host,
        [
          [IRouteConfigs, [
            { route: ['', 'home'], moduleId: 'pages/home/home' }
          ]]
        ],
        (aurelia, viewModel) => {
          expect(viewModel instanceof BaseRoutingComponent).toBe(true);
          expect(viewModel.router.currentInstruction.fragment).toBe('/');
          verifyElementsCount(viewModel.element, '.home-route', 1);
        }
      ));
    });
  });

  describe('dynamic root app', () => {
    it('bootstraps', async () => {
      let lifecycleCount = 0;
      await bootstrap(createEntryConfigure(
        'pages/app/app',
        host,
        [
          [IRouteConfigs, [
            { route: '', moduleId: 'pages/home/home' }
          ]],
          ['pages/app/app', {
            created: viewModel => {
              verifyElementsCount(viewModel.view.firstChild.parentNode, [
                ['.app', 1],
                ['.home-route', 1]
              ]);
              lifecycleCount++;
            },
            attached: viewModel => {
              verifyElementsCount(viewModel.element, [
                ['.app', 1],
                ['.home-route', 1]
              ]);
              lifecycleCount++;
            }
          }]
        ],
        function onBootstrapped(aurelia, viewModel) {
          expect(lifecycleCount).toBe(2);
          expect(viewModel.router.currentInstruction.fragment).toBe('/');
        }
      ));
    });

    it('bootstrap with multiple routes', async () => {
      let lifecycleCount = 0;
      await bootstrap(createEntryConfigure(
        'pages/app/app',
        host,
        [
          [IRouteConfigs, [
            { route: '', moduleId: 'pages/home/home' },
            { route: 'dashboard', moduleId: 'pages/dashboard/dashboard' }
          ]],
          ['pages/app/app', {
            created: viewModel => {
              verifyElementsCount(viewModel.view.firstChild.parentNode, [
                ['.app', 1],
                ['.home-route', 1]
              ]);
              lifecycleCount++;
            },
            attached: viewModel => {
              verifyElementsCount(viewModel.element, [
                ['.app', 1],
                ['.home-route', 1]
              ]);
              lifecycleCount++;
            }
          }],
          ['pages/home/home', {
            attached: viewModel => {
              lifecycleCount++;
            }
          }]
        ],
        (aurelia, viewModel) => {
          expect(lifecycleCount).toBe(3);
          expect(viewModel.router.currentInstruction.fragment).toBe('/');
        }
      ));
    });
  });

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
