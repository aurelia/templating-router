import './setup';
import {
  wait,
  h,
  createEntryConfigure,
  IRouteConfigs,
  verifyElementsCount,
  bootstrapAppWithTimeout,
  ILifeCyclesAssertions,
  cleanUp,
  getNormalizedHash
} from './utilities';
import { addDebugLogging, removeDebugLogging } from './utilities';
import { NavigationInstruction, RouterConfiguration, RouteConfig, UnknownRouteConfigSpecifier, Router, RouteCommand } from 'aurelia-router';
import { Aurelia } from 'aurelia-framework';

describe('Multiple Viewports -- INTEGRATION', () => {

  let aurelia: Aurelia;

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(async () => {
    removeDebugLogging();
    location.hash = '';
    await wait();
  });

  beforeEach(() => {
    cleanUp(aurelia);
    location.hash = '';
  });

  afterEach(() => {
    cleanUp(aurelia);
    location.hash = '';
  });

  it('bootstrap with multiple viewports', async () => {
    let lifecycleCount = 0;
    location.hash = '';
    aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
      'pages/complex-app/app',
      h('div'),
      [
        [IRouteConfigs, [
          { route: '', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
        ]],
        ['pages/complex-app/app', {
          created: viewModel => {
            verifyElementsCount(viewModel.view.firstChild.parentNode, [
              ['.complex-app', 1],
              ['.home-route', 2]
            ]);
            lifecycleCount++;
          },
          attached: viewModel => {
            verifyElementsCount(viewModel.element, [
              ['.complex-app', 1],
              ['.home-route', 2]
            ]);
            lifecycleCount++;
          }
        }]
      ],
      function onBootstrapped(aurelia, viewModel) {
        expect(viewModel.router.currentInstruction.fragment).toBe('/');
      }
    ));
    expect(lifecycleCount).toBe(2);
  });

  it('fails when viewports configs mismatch', async () => {
    let lifecycleCount = 0;
    aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
      'pages/complex-app/app',
      h('div'),
      [
        [IRouteConfigs, [
          { route: '', viewPorts: { default: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/contacts/contacts' } } }
        ]],
        ['pages/complex-app/app', {
          created: viewModel => {
            verifyElementsCount(viewModel.view.firstChild.parentNode, [
              ['.complex-app', 1],
              ['.home-route', 2]
            ]);
            lifecycleCount++;
          },
          attached: viewModel => {
            verifyElementsCount(viewModel.element, [
              ['.complex-app', 1],
              ['.home-route', 2]
            ]);
            lifecycleCount++;
          }
        }]
      ],
      function onBootstrapped(aurelia, viewModel) {
        expect(viewModel.router.currentInstruction.fragment).toBe('/');
      },
      function onBootstrappFailed(error) {
        expect(error instanceof Error).toBe(true);
        lifecycleCount = 10;
      }
    ), function onBootstrapTimeout() {
      lifecycleCount = 20;
    }, 1000);
    expect(lifecycleCount).toBe(20);
    cleanUp(aurelia);
  });

  describe('> mapUnknownRoutes()', () => {

    it('> mapUnknownRoutes({ ...object })', async () => {
      let lifecycleCount = 0;
      expect(location.hash).toBe('');
      aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
        'pages/complex-app/app',
        h('div'),
        [
          [IRouteConfigs, [
            // TODO: fix issues when the route fails to redirect when there is no "name" property
            { route: 'landing', name: 'landing-route', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
          ]],
          ['pages/complex-app/app', {
            configureRouter: (viewModel, config: RouterConfiguration, router) => {
              config.mapUnknownRoutes({ redirect: 'landing' });
            },
            created: viewModel => {
              verifyElementsCount(viewModel.view.firstChild.parentNode, [
                ['.complex-app', 1],
                ['.home-route', 2]
              ]);
              lifecycleCount++;
            },
            attached: viewModel => {
              verifyElementsCount(viewModel.element, [
                ['.complex-app', 1],
                ['.home-route', 2]
              ]);
              lifecycleCount++;
            }
          }]
        ],
        function onBootstrapped(aurelia, viewModel) {
          expect(viewModel.router.currentInstruction.fragment).toBe('/landing');
        }
      ));
      expect(location.hash).toBe('#/landing');
      expect(lifecycleCount).toBe(2);
    });

    describe('> mapUnknownRoutes(instruction => ...)', () => {

      it('> mapUnknownRoutes(instruction => ({ redirect: ... }))', async () => {
        let lifecycleCount = 0;
        expect(location.hash).toBe('');
        aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
          'pages/complex-app/app',
          h('div'),
          [
            [IRouteConfigs, <RouteConfig[]>[
              {
                route: 'landing',
                viewPorts: {
                  left: { moduleId: 'pages/home/home' },
                  right: { moduleId: 'pages/home/home' }
                }
              }
            ]],
            ['pages/complex-app/app', <ILifeCyclesAssertions>{
              configureRouter: (viewModel, config: RouterConfiguration, router: Router) => {
                return config.mapUnknownRoutes((navInstruction: NavigationInstruction) => {
                  expect(lifecycleCount).toBe(0);
                  lifecycleCount += 100;
                  return { redirect: 'landing' };
                });
              },
              created: viewModel => {
                verifyElementsCount(viewModel.view.firstChild.parentNode, [
                  ['.complex-app', 1],
                  ['.home-route', 2]
                ]);
                lifecycleCount++;
              },
              attached: viewModel => {
                verifyElementsCount(viewModel.element, [
                  ['.complex-app', 1],
                  ['.home-route', 2]
                ]);
                lifecycleCount++;
              }
            }]
          ],
          function onBootstrapped(aurelia, viewModel) {
            expect(viewModel.router.currentInstruction.fragment).toBe('/landing');
          }
        ));
        expect(getNormalizedHash()).toBe('#/landing');
        expect(lifecycleCount).toBe(102);
      });

      it('> mapUnknownRoutes(instruction => ({ moduleId: ... }))', async () => {
        let lifecycleCount = 0;
        expect(location.hash).toBe('');
        aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
          'pages/app/app',
          h('div'),
          [
            [IRouteConfigs, <RouteConfig[]>[
              // TODO: fix issues when the route fails to redirect when there is no "name" property
              { route: 'landing', name: 'landing-route', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
            ]],
            ['pages/app/app', <ILifeCyclesAssertions>{
              configureRouter: (viewModel, config: RouterConfiguration, router: Router) => {
                return config.mapUnknownRoutes((navInstruction: NavigationInstruction) => {
                  expect(lifecycleCount).toBe(0);
                  lifecycleCount += 100;
                  return { moduleId: 'pages/home/home' };
                });
              },
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
            expect(viewModel.router.currentInstruction.fragment).toBe('/');
          }
        ));
        expect(location.hash).toBe('');
        expect(lifecycleCount).toBe(102);
      });

      it('> mapUnknownRoutes(instruction => ({ viewModel: ... }))', async () => {
        let lifecycleCount = 0;
        expect(location.hash).toBe('');
        aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
          'pages/app/app',
          h('div'),
          [
            [IRouteConfigs, <RouteConfig[]>[
              // TODO: fix issues when the route fails to redirect when there is no "name" property
              { route: 'landing', name: 'landing-route', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
            ]],
            ['pages/app/app', <ILifeCyclesAssertions>{
              configureRouter: (viewModel, config: RouterConfiguration, router: Router) => {
                return config.mapUnknownRoutes((navInstruction: NavigationInstruction): RouteCommand => {
                  expect(lifecycleCount).toBe(0);
                  lifecycleCount += 100;
                  return { viewModel: () => class Home { static $view = '<template><div class="home-route-inline"></div></template>'; } };
                });
              },
              created: viewModel => {
                verifyElementsCount(viewModel.view.firstChild.parentNode, [
                  ['.app', 1],
                  ['.home-route-inline', 1]
                ]);
                lifecycleCount++;
              },
              attached: viewModel => {
                verifyElementsCount(viewModel.element, [
                  ['.app', 1],
                  ['.home-route-inline', 1]
                ]);
                lifecycleCount++;
              }
            }]
          ],
          function onBootstrapped(aurelia, viewModel) {
            expect(viewModel.router.currentInstruction.fragment).toBe('/');
          }
        ));
        expect(location.hash).toBe('');
        expect(lifecycleCount).toBe(102);
      });
    });

    // This test feels a bit off for aurelia router
    // as it requires the <router-view/> host to have a default view port
    // otherwise route won't be able to load in
    it('> mapUnknownRoutes("some-module-id")', async () => {
      let lifecycleCount = 0;
      expect(location.hash).toBe('');
      aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
        'pages/app/app',
        h('div'),
        [
          [IRouteConfigs, <RouteConfig[]>[
            // TODO: fix issues when the route fails to redirect when there is no "name" property
            { route: 'landing', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
          ]],
          ['pages/app/app', <ILifeCyclesAssertions>{
            configureRouter: (viewModel, config: RouterConfiguration, router: Router) => {
              lifecycleCount += 100;
              return config.mapUnknownRoutes('pages/home/home');
            },
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
          expect(viewModel.router.currentInstruction.fragment).toBe('/');
        }
      ));
      expect(location.hash).toBe('');
      expect(lifecycleCount).toBe(102);
    });
  });

  describe('[swap-order]', function _x_MultipleViewPorts__With_SwapOrder__Tests() {

    it('bootstrap with [swap-order]', async () => {
      let lifecycleCount = 0;
      location.hash = '';
      aurelia = await bootstrapAppWithTimeout(createEntryConfigure(
        'pages/swap-order-app/app',
        h('div'),
        [
          [IRouteConfigs, [
            {
              route: '',
              viewPorts: {
                left: { moduleId: 'pages/home/home' },
                right: { moduleId: 'pages/home/home' }
              }
            }
          ]],
          ['pages/swap-order-app/app', {
            created: viewModel => {
              verifyElementsCount(viewModel.view.firstChild.parentNode, [
                ['.swap-order-app', 1],
                ['.home-route', 2]
              ], 'It should have right elements in "created"');
              lifecycleCount++;
            },
            attached: viewModel => {
              verifyElementsCount(viewModel.element, [
                ['.swap-order-app', 1],
                ['.home-route', 2]
              ], 'It should have right elements in "attached"');
              lifecycleCount++;
            }
          }]
        ],
        function onBootstrapped(aurelia, viewModel) {
          expect(viewModel.router.currentInstruction.fragment).toBe('/');
        }
      ));
      expect(lifecycleCount).toBe(2);
    });
  });
});
