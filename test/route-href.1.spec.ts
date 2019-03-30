import './setup';
import './shared';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router, RouterConfiguration, RouteConfig, AppRouter, ConfiguresRouter } from 'aurelia-router';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { RouteHref } from '../src/route-href';
import { wait } from './utilities';
import { addDebugLogging, removeDebugLogging } from './shared';
import { Logger } from 'aurelia-logging';

describe('[route-href]', () => {
  let component: ComponentTester<RouteHref>;
  let view: string;
  let viewModelData: Record<string, any>;

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(() => {
    removeDebugLogging();
  });

  beforeEach(() => {
    view = '';
    viewModelData = {};
  });

  afterEach(() => {
    if (component) {
      const appRouter = component.viewModel.router as AppRouter;
      appRouter.reset();
      appRouter.deactivate();
      component.dispose();
      component = undefined;
    }
    location.hash = '';
  });

  describe('Basic feature without <router-view/>', function _1_base_feature__Tests() {
    describe('does not throw when binding with primary property', () => {
      for (const command of ['bind', 'one-time', 'to-view', 'two-way']) {
        it(`with "${command}" binding command`, async () => {
          component = createComponent(
            `<a route-href.${command}="name"></a>`,
            undefined,
            { name: 'route-b' }
          );
          const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
          await component.create(bootstrap);

          // ensure processChange got called, but didn't break
          expect(spy).toHaveBeenCalledTimes(1);
          expect(component.viewModel instanceof RouteHref).toBe(true);
          expect(component.viewModel.route).toBe('route-b');
          expect(component.viewModel.element.getAttribute('href')).toBe(null);
        });
      }

      it('with plain attribute', async () => {
        component = createComponent('<a route-href="route-a"></a>');
        const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
        await component.create(bootstrap);

        // ensure processChange got called, but didn't break
        expect(spy).toHaveBeenCalledTimes(1);
        expect(component.viewModel instanceof RouteHref).toBe(true);
        expect(component.viewModel.route).toBe('route-a');
        expect(component.viewModel.element.getAttribute('href')).toBe(null);
      });
    });

    describe('does not throw when binding with all properties', () => {
      for (const command of ['bind', 'one-time', 'to-view', 'two-way']) {
        for (const params of [null, undefined, 5, Symbol(), {}, function() {/**/}, []]) {
          it(`with "${command}" & ${String(params)} params`, async () => {
            component = createComponent(
              `<a route-href="route.${command}: name; params.bind: params;"></a>`,
              undefined,
              { name: 'route-b', params: params }
            );
            const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
            await component.create(bootstrap);
            const routeHref = component.viewModel;
            // ensure processChange got called, but didn't break
            expect(spy).toHaveBeenCalledTimes(1);
            expect(routeHref instanceof RouteHref).toBe(true);
            expect(routeHref.route).toBe('route-b');
            expect(routeHref.params).toBe(params);
            expect(component.viewModel.element.getAttribute('href')).toBe(null);
          });
        }
      }
    });

  });

  describe('with <router-view />', () => {

    beforeEach(() => {
      view = `<div route-href="route-a"></div><router-view></router-view>`;
    });

    describe('does not throw when binding with primary property', () => {
      for (const command of ['bind', 'one-time', 'one-way', 'two-way']) {
        it(`with "${command}" binding command`, async () => {
          const ROUTE = '#/b';
          const ROUTE_OF_CHOICE = 'route-b';
          component = createComponent(
            `
              <div route-href.bind="name"></div>
              <router-view></router-view>
            `,
            undefined,
            { name: ROUTE_OF_CHOICE }
          );
          const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
          await component.create(bootstrap);

          // ensure processChange got called, but didn't break
          expect(spy).toHaveBeenCalledTimes(1);
          const routeHref = component.viewModel;
          expect(routeHref.route).toBe(ROUTE_OF_CHOICE);
          expect(routeHref.element.getAttribute('href')).toBe(ROUTE);
        });
      }

      it('with plain attribute', async () => {
        // [#/] and [#/a] are both valid
        // Probably route recognizer prefers to be more precise
        // otherwise, ROUTE should have been both "#/a"
        const ROUTE = '#/';
        const ROUTE_OF_CHOICE = 'route-a';
        component = createComponent(
          `
            <div route-href="${ROUTE_OF_CHOICE}"></div>
            <router-view></router-view>
          `
        );
        const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
        await component.create(bootstrap);

        // ensure processChange got called, but didn't break
        expect(spy).toHaveBeenCalledTimes(1);
        const routeHref = component.viewModel;
        expect(routeHref instanceof RouteHref).toBe(true);
        expect(routeHref.route).toBe('route-a');
        expect(routeHref.element.getAttribute('href')).toBe(ROUTE);
      });
    });

    describe('with INVALID "route" name', () => {
      const invalidRoutes: any[] = [
        '',
        'route-c',
        null,
        undefined,
        5,
        [],
        {}
      ];
      for (const routeName of invalidRoutes) {
        it(`throws when binding "route" to invalid route name: "${routeName}"`, async () => {
          component = createComponent(`<a route-href.bind="name"></a><router-view></router-view>`, undefined, { name: routeName });
          const errors: Set<any> = new Set();
          const spy = spyOn(Logger.prototype, 'error').and.callFake((err: any) => errors.add(err));
          await component.create(bootstrap);
          expect(spy.calls.count()).toBeGreaterThan(0);
          expect(Array.from(errors).some(err => ('' + err).includes(`A route with name '${routeName}' could not be found.`)));
        });
      }
    });
  });

  class DefaultAppViewModel implements ConfiguresRouter {
    config: RouteConfig | RouteConfig[];
    router: Router;

    constructor() {
      if (!this.config) {
        this.config = [
          { route: ['', 'a'], name: 'route-a', nav: true, moduleId: 'test/routes/route-1' },
          { route: 'b', name: 'route-b', nav: true, moduleId: 'test/routes/route-2' }
        ];
      }
    }

    configureRouter(config: RouterConfiguration, router: Router) {
      config.map(this.config);
      this.router = router;
    }
  }

  function createComponent(
    $view: string = view,
    $viewModel: unknown = DefaultAppViewModel,
    $viewModelData: Record<string, any> = viewModelData || {}
  ) {
    let $comp = StageComponent
      .withResources()
      .inView($view);

    $comp.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      const $vm = aurelia.container.viewModel = typeof $viewModel === 'function'
        ? aurelia.container.get($viewModel)
        : $viewModel;

      Object.assign($vm, $viewModelData);

      $comp.boundTo($vm);

      return aurelia.use;
    });

    return $comp;
  }


});
