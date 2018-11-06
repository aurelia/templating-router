// import './setup';
import { RouteLoader } from 'aurelia-router';
import { TemplatingRouteLoader } from '../../src';
import { Container, metadata, HtmlBehaviorResource } from 'aurelia-framework';
import { EmptyClass } from '../../src/route-loader';

describe('RouteLoader -- UNIT', () => {

  let routeLoader: TemplatingRouteLoader;

  beforeEach(() => {
    routeLoader = new TemplatingRouteLoader(null);
  });

  it('constructs', () => {
    [null, undefined, 5, '', Symbol(), function() { }, [], {}].forEach((v: any) => {
      expect(() => routeLoader = new TemplatingRouteLoader(v)).not.toThrow();
      expect(new TemplatingRouteLoader(v) instanceof RouteLoader).toBe(true);
    });
  });

  describe('resolveViewModel()', function _1_resolveViewModel__Tests() {
    it('rejects when there is no "moduleId" or "viewModel" in config', async () => {
      const ex = await routeLoader.resolveViewModel(null!, {}).catch(ex1 => ex1);
      expect(ex instanceof Error).toBe(true);
      expect(ex.toString()).toBe(new Error('Invalid route config. No "moduleId"/"viewModel" found.').toString());
    });

    it('resolves "moduleId" as string', async () => {
      const ex = await routeLoader.resolveViewModel(
        { container: { viewModel: {} } } as any,
        { moduleId: 'a' });
      expect(ex).toBe('a');
    });

    it('resolves to class when "moduleId" is a html module', async () => {
      let dynamicClass1;
      let dynamicClass2;
      let dynamicClass = dynamicClass1 = await routeLoader.resolveViewModel(null!, { moduleId: 'a.html' }) as Function;
      expect(typeof dynamicClass).toBe('function');
      let r = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r['elementName']).toBe('a');

      dynamicClass = await routeLoader.resolveViewModel(null!, { moduleId: 'aBcDeF.html' }) as Function;
      expect(typeof dynamicClass).toBe('function');
      r = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r['elementName']).toBe('a-bc-de-f');

      dynamicClass = dynamicClass2 = await routeLoader.resolveViewModel(null!, { moduleId: 'a.html' }) as Function;
      expect(typeof dynamicClass).toBe('function');
      r = metadata.getOwn(metadata.resource, dynamicClass) as HtmlBehaviorResource;
      expect(r['elementName']).toBe('a');
      expect(dynamicClass1).not.toBe(dynamicClass2);
    });

    it('resolves to EmptyClass when "moduleId" is null', async () => {
      const theClass = await routeLoader.resolveViewModel(null!, { moduleId: null }) as Function;
      expect(theClass).toBe(EmptyClass);
    });

    describe('with "viewModel" config', () => {
      it('does not resolve "viewModel" synchronously', async () => {
        const error = new Error('Async') as any;
        const ex = await routeLoader.resolveViewModel(null!, { viewModel: () => { throw error; } }).catch(e => e);
        expect(ex).toBe(error);
      });

      it('resolves a function value', async () => {
        class Abc { }
        const vm = await routeLoader.resolveViewModel(null!, { viewModel: () => Abc });
        expect(vm).toBe(Abc);
      });

      it('resolves a module like value', async () => {
        const moduleAbc = {
          default: class Abc { }
        };
        const vm = await routeLoader.resolveViewModel(null!, { viewModel: () => moduleAbc as any });
        expect(vm).toBe(moduleAbc.default);
      });

      it('resolves promise<function> value', async () => {
        class Abc { }
        const vm = await routeLoader.resolveViewModel(null!, { viewModel: () => Promise.resolve(Abc) });
        expect(vm).toBe(Abc);
      });

      it('resolves promise<module like> value', async () => {
        const moduleAbc = {
          default: class Abc { }
        };
        const vm = await routeLoader.resolveViewModel(null!, { viewModel: () => Promise.resolve(moduleAbc) });
        expect(vm).toBe(moduleAbc.default);
      });

      describe('with invalid "viewModel" resolution', () => {
        [null, undefined, 5, 'a random string', Symbol(), []].forEach((v: any) => {
          it(`rejects with "Invalid view model config" when "viewModel" is "${Array.isArray(v) ? '[]' : String(v)}"`, async () => {
            let ex = await routeLoader.resolveViewModel(null!, { viewModel: () => v }).catch(e => e);
            expect(ex instanceof Error).toBe(true);
            expect(ex.toString()).toContain('Invalid view model config');

            ex = await routeLoader.resolveViewModel(null!, { viewModel: () => Promise.resolve(v) }).catch(e => e);
            expect(ex instanceof Error).toBe(true);
            expect(ex.toString()).toContain('Invalid view model config');
          });
        });

        it('rejects with "Invalid view model config" when "viewModel" is an object without default export', async () => {
          let ex = await routeLoader.resolveViewModel(null!, { viewModel: () => ({} as any) }).catch(e => e);
          expect(ex instanceof Error).toBe(true);
          expect(ex.toString()).toContain('Invalid view model config');

          ex = await routeLoader.resolveViewModel(null!, { viewModel: () => Promise.resolve({}) }).catch(e => e);
          expect(ex instanceof Error).toBe(true);
          expect(ex.toString()).toContain('Invalid view model config');
        });
      });
    });
  });
});
