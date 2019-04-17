import './setup';
import { RouteLoader, Router, RouteConfig } from 'aurelia-router';
import { TemplatingRouteLoader } from '../src/aurelia-templating-router';
import { Container, metadata, HtmlBehaviorResource, CompositionEngine, ViewLocator, RelativeViewStrategy } from 'aurelia-framework';
import { EmptyClass, createDynamicClass } from '../src/route-loader';
import { RouterViewLocator } from '../src/router-view';
import { History } from 'aurelia-history';

describe('RouteLoader -- UNIT', () => {

  let routeLoader: TemplatingRouteLoader;

  beforeEach(() => {
    routeLoader = new TemplatingRouteLoader(null);
  });

  it('constructs', () => {
    [null, undefined, 5, '', Symbol(), function() {/**/}, [], {}].forEach((v: any) => {
      expect(() => routeLoader = new TemplatingRouteLoader(v)).not.toThrow();
      expect(new TemplatingRouteLoader(v) instanceof RouteLoader).toBe(true);
    });
  });

  describe('resolveViewModel()', function _1_resolveViewModel__Tests() {
    it('rejects when there is no "moduleId" in config', async () => {
      const ex = await routeLoader.resolveViewModel(null!, {} as RouteConfig).catch(ex1 => ex1);
      expect(ex instanceof Error).toBe(true);
      expect(ex.toString()).toBe(new Error('Invalid route config. No "moduleId" found.').toString());
    });

    it('resolves "moduleId" as string', async () => {
      const ex = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as any,
        { moduleId: 'a' } as RouteConfig
      );
      expect(ex).toBe('a');
    });

    it('resolves to class when "moduleId" is a html module', async () => {
      let dynamicClass1;
      let dynamicClass2;
      let dynamicClass = dynamicClass1 = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as Router,
        { moduleId: 'a.html' } as RouteConfig
      ) as Function;
      expect(typeof dynamicClass).toBe('function');
      let r: any = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r.elementName).toBe('a');

      dynamicClass = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as Router,
        { moduleId: 'aBcDeF.html' } as RouteConfig
      ) as Function;
      expect(typeof dynamicClass).toBe('function');
      r = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r.elementName).toBe('a-bc-de-f');

      dynamicClass = dynamicClass2 = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as Router,
        { moduleId: 'a.html' } as RouteConfig
      ) as Function;
      expect(typeof dynamicClass).toBe('function');
      r = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r.elementName).toBe('a');
      expect(dynamicClass1).not.toBe(dynamicClass2);
    });

    it('resolves to EmptyClass when "moduleId" is null', async () => {
      const theClass = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as Router,
        { moduleId: null } as RouteConfig
      ) as Function;
      expect(theClass).toBe(EmptyClass);
    });
  });

  describe('createChildContainer()', () => {
    it('creates', () => {
      let childContainer: MockRouterContainer;
      const childContainers: Set<Container> = new Set();
      const router = {
        container: {
          createChild: jasmine.createSpy('container.createChild').and.callFake(() => childContainer) as any
        }
      } as Router;

      let i = 0;
      while (i < 5) {
        const childRouter = {} as Router;
        childContainer = {
          registerSingleton: jasmine.createSpy('registerSingleton'),
          registerHandler: jasmine.createSpy('registerHandler').and.callFake(() => childRouter),
          get: (() => childRouter) as any
        } as MockRouterContainer;

        const $childContainer = routeLoader.createChildContainer(router);
        expect(router.container.createChild).toHaveBeenCalledTimes(++i);
        expect($childContainer).toBe(childContainer);
        expect(childContainer.registerSingleton).toHaveBeenCalledTimes(1);
        expect(childContainer.registerSingleton).toHaveBeenCalledWith(RouterViewLocator);
        expect(typeof childContainer.getChildRouter).toBe('function');
        const $childRouter = childContainer.getChildRouter();
        expect($childRouter).toBe(childRouter);
        expect(childContainer.registerHandler).toHaveBeenCalledTimes(1);
        expect((childContainer.registerHandler as jasmine.Spy).calls.mostRecent().args.includes(Router)).toBe(true);

        childContainers.add($childContainer);
      }
      expect(childContainers.size).toBe(5);
    });

    it('creates real', () => {
      const container = new Container();
      routeLoader = container.get(TemplatingRouteLoader);
      const router = new Router(container, new History() as any);
      const childContainer = routeLoader.createChildContainer(router);
      const childRouter = childContainer.getChildRouter!();
      childRouter.parent = null;
      const resolver = childContainer.getResolver(Router);
      expect(resolver.strategy).toBe(3);
      expect(childContainer.hasResolver(Router));
      expect(childContainer.get(Router)).toBe(childRouter);
    });
  });

  describe('loadRoute()', () => {
    it('calls resolveViewModel() with right params', async () => {
      const router: any = [];
      const config: any = [];
      const navInstruction: any = {};
      const spy = spyOn(routeLoader, 'resolveViewModel');

      let i = 0;
      while (i < 5) {
        try {
          await routeLoader.loadRoute(router, config, navInstruction);
        } catch {/**/}
        expect(spy).toHaveBeenCalledTimes(++i);
        expect(spy).toHaveBeenCalledWith(router, config);
      }
    });

    it('creates childContainer, registers RouteViewLocator and setups childRouter', async () => {
      routeLoader.compositionEngine = {
        ensureViewModel: jasmine.createSpy('CompositionEngine.ensureViewModel') as any
      } as CompositionEngine;
      const childContainer = {
        registerSingleton: jasmine.createSpy('registerSingleton')
      } as MockRouterContainer;
      const router = {
        container: {
          createChild: jasmine.createSpy('createChild').and.callFake(() => childContainer)
        }
      };
      const config: any = { moduleId: null };
      const navInstruction: any = {};

      let i = 0;
      while (i < 5) {
        try {
          await routeLoader.loadRoute(router as any, config, navInstruction);
        } catch (ex) {
          expect(0).toBe(1, `Expected no error. But got: ${ex}`);
        }

        expect(router.container.createChild).toHaveBeenCalledTimes(++i);
        expect(childContainer.registerSingleton).toHaveBeenCalledTimes(i);
        expect(childContainer.registerSingleton).toHaveBeenCalledWith(RouterViewLocator);
        expect();
      }
    });
  });

  describe('createDynamicClass()', () => {
    const cases: [string, string][] = [
      ['a.html', 'a'],
      ['aBcDeF.html', 'a-bc-de-f'],
      ['.../a.html', 'a'],
      ['https://s.html', 's'],
      ['///s.html', 's'],
      ['///s.js.html', 's.js']
    ];

    for (const [moduleId, customElementName] of cases) {
      it(`creates for moduleId: "${moduleId}"`, () => {
        let klass;
        expect(() => klass = createDynamicClass(moduleId)).not.toThrow();
        const viewStrategy = metadata.getOwn(ViewLocator.viewStrategyMetadataKey, klass) as any;
        expect(viewStrategy instanceof RelativeViewStrategy).toBe(true);
        expect(viewStrategy.path).toBe(moduleId);

        const r = metadata.getOwn(metadata.resource, klass) as any;
        expect(r.elementName).toBe(customElementName);
      });
    }

  });
});

interface MockRouterContainer extends Container {
  registerHandler: any;
  registerSingleton: any;
  getChildRouter: any;
}
