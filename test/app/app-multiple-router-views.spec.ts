import './setup';
import { wait, h, createEntryConfigure, IRouteConfigs, verifyElementsCount, bootstrapAppWithTimeout } from './utilities';
import { bootstrap } from 'aurelia-bootstrapper';
import { addDebugLogging, removeDebugLogging } from './utilities';
import { NavigationInstruction, RouterConfiguration } from 'aurelia-router';

fdescribe('Multiple Viewports -- INTEGRATION', () => {

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(() => {
    removeDebugLogging();
  });

  afterEach(() => {
    location.hash = '';
  });

  it('bootstrap with multiple viewports', async () => {
    let lifecycleCount = 0;
    await bootstrap(createEntryConfigure(
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
    await bootstrapAppWithTimeout(createEntryConfigure(
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
  });

  describe('multiple viewports boostrapping with mapUnknownRoutes()', () => {

    it('with mapUnknownRoutes({ ...object })', async () => {
      let lifecycleCount = 0;
      expect(location.hash).toBe('');
      await bootstrap(createEntryConfigure(
        'pages/complex-app/app',
        h('div'),
        [
          [IRouteConfigs, [
            // TODO: fix issues when the route fails to redirect when there is no "name" property
            { route: 'landing', name: 'landing-route', viewPorts: { left: { moduleId: 'pages/home/home' }, right: { moduleId: 'pages/home/home' } } }
          ]],
          ['pages/complex-app/app', {
            configureRouter: (viewModel, config: RouterConfiguration, router) => {
              config.mapUnknownRoutes({ route: '*', redirect: 'landing' });
              // config.mapUnknownRoutes((navInstruction: NavigationInstruction) => {
              //   navInstruction.config.route = 'landing';
              //   navInstruction.config.redirect = 'landing-route';
              // });
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

    it('with mapUnknownRoutes(instruction => ...)', async () => {

    });
  });
});
