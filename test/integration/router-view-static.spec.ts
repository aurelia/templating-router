import { ComponentTester, StageComponent } from 'aurelia-testing';
import { RouterView } from '../../src';
import { RouterConfiguration, Router, AppRouter } from 'aurelia-router';
import { verifyElementsCount, wait } from './utilities';
import { Logger } from 'aurelia-logging';
import { Aurelia } from 'aurelia-framework';

describe('<router-view/> with "viewModel"', function() {

  let viewModel: unknown;
  let view: string;
  let component: ComponentTester<RouterView>;

  beforeEach(async () => {
    component = undefined;
    window.location.hash = '#/';
    await Promise.resolve();
  });

  afterEach(async () => {
    if (component) {
      (component.viewModel.router as AppRouter).deactivate();
      component.dispose();
    }
    await Promise.resolve();
  });

  // beforeAll(patchComponentTeser);

  // afterAll(unpatchComponentTester);

  beforeEach(function __setup__() {
    view = '<router-view></router-view>';
  });

  describe('with basic usage', function _1_basic_usage__Tests() {
    it('loads', async () => {
      viewModel = new class App {
        router: Router;
        configureRouter(config: RouterConfiguration, router: Router) {
          config.map([
            {
              route: '',
              viewModel: () =>
                class Abc {
                  static $view = '<template><div class="route-1"></template>';
                }
            }
          ]);
          this.router = router;
        }
      };
      component = createComponent();
      await component.create(simpleBootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      verifyElementsCount(component, '.route-1', 1);
    });

    it('fails when there is no view strategy associated with the "viewModel"', async () => {
      viewModel = new class App {
        router: Router;
        configureRouter(config: RouterConfiguration, router: Router) {
          config.map([
            {
              route: '',
              viewModel: () => class Abc { }
            }
          ]);
          this.router = router;
        }
      };
      component = createComponent();
      let error: Error;
      const spy = spyOn(Logger.prototype, 'error').and.callFake((err: any) => error ? null : error = err);
      await component.create(simpleBootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      verifyElementsCount(component, '.route-1', 0);
      expect(component.element.childElementCount).toBe(0);
      expect(spy).toHaveBeenCalled();
      expect(error + '').toContain('Cannot determine default view strategy');
    });
  });

  describe('tricky usage', () => {
    it('does not recreate the view model when using two route with same "viewModel" resolution', async () => {
      let instanceCount = 0;
      let resolutionCount = 0;
      class Abc {
        static $view = '<template><div class="route-1"></template>';
        constructor() {
          instanceCount++;
        }
      }
      viewModel = new class App {
        router: Router;
        configureRouter(config: RouterConfiguration, router: Router) {
          config.map([
            {
              route: '', viewModel: () => {
                resolutionCount++;
                return Abc;
              }
            },
            {
              route: 'home', viewModel: () => {
                resolutionCount++;
                return Abc;
              }
            },
            {
              route: 'contacts', viewModel: () => {
                resolutionCount++;
                return Abc;
              }
            }
          ]);
          this.router = router;
        }
      };
      component = createComponent();
      await component.create(simpleBootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      verifyElementsCount(component, '.route-1', 1);
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(1);
      await component.viewModel.router.navigate('#/home');
      expect(instanceCount).toBe(1);
      // TODO: work out this jump
      expect(resolutionCount).toBe(3);
      await component.viewModel.router.navigate('#/contacts');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(4);
      await component.viewModel.router.navigate('#/');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(5);
    });

    it('works with Promise', async () => {
      let instanceCount = 0;
      let resolutionCount = 0;
      class Abc {
        static $view = '<template><div class="route-1"></template>';
        constructor() {
          instanceCount++;
        }
      }
      viewModel = new class App {
        router: Router;
        configureRouter(config: RouterConfiguration, router: Router) {
          config.map([
            {
              route: '', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return Abc;
              })
            },
            {
              route: 'home', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return Abc;
              })
            },
            {
              route: 'contacts', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return Abc;
              })
            }
          ]);
          this.router = router;
        }
      };
      component = createComponent();
      await component.create(simpleBootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      verifyElementsCount(component, '.route-1', 1);
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(1);
      await component.viewModel.router.navigate('#/home');
      expect(instanceCount).toBe(1);
      // TODO: work out this jump
      expect(resolutionCount).toBe(3);
      await component.viewModel.router.navigate('#/contacts');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(4);
      await component.viewModel.router.navigate('#/');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(5);
    });

    it('works with default export', async () => {
      let instanceCount = 0;
      let resolutionCount = 0;
      class Abc {
        static $view = '<template><div class="route-1"></template>';
        constructor() {
          instanceCount++;
        }
      }
      viewModel = new class App {
        router: Router;
        configureRouter(config: RouterConfiguration, router: Router) {
          config.map([
            {
              route: '', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return Abc;
              })
            },
            {
              route: 'home', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return { default: Abc };
              })
            },
            {
              route: 'contacts', viewModel: () => Promise.resolve().then(() => {
                resolutionCount++;
                return { default: Abc };
              })
            }
          ]);
          this.router = router;
        }
      };
      component = createComponent();
      await component.create(simpleBootstrap);
      expect(component.viewModel instanceof RouterView).toBe(true);
      verifyElementsCount(component, '.route-1', 1);
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(1);
      await component.viewModel.router.navigate('#/home');
      expect(instanceCount).toBe(1);
      // TODO: work out this jump
      expect(resolutionCount).toBe(3);
      await component.viewModel.router.navigate('#/contacts');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(4);
      await component.viewModel.router.navigate('#/');
      expect(instanceCount).toBe(1);
      expect(resolutionCount).toBe(5);
    });
  });

  function createComponent($view: string = view) {
    let $comp = StageComponent
      .withResources()
      .inView($view);

    $comp.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.viewModel = typeof viewModel === 'function'
        ? aurelia.container.get(viewModel)
        : viewModel;

      return aurelia.use;
    });

    return $comp;
  }

  async function simpleBootstrap(configure: (aurelia: Aurelia) => Promise<void>): Promise<void> {
    const aurelia = new Aurelia();
    return configure(aurelia);
  }
});
