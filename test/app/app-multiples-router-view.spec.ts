import './setup';
import { wait, h, createEntryConfigure, IRouteConfigs, verifyElementsCount, bootstrapAppWithTimeout } from './utilities';
import { bootstrap } from 'aurelia-bootstrapper';
import { addDebugLogging, removeDebugLogging } from './utilities';

describe('Multiple Viewports -- INTEGRATION', () => {

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(() => {
    removeDebugLogging();
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
    });
    expect(lifecycleCount).toBe(20);
  });

});
