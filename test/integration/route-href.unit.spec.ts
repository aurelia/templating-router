import '../setup';
import { Container } from 'aurelia-framework';
import { Logger } from 'aurelia-logging';
import { Router } from 'aurelia-router';
import { RouteHref } from '../../src';
import { wait } from './utilities';

describe('[route-href] -- UNIT', () => {
  let container: Container;
  let routeHref: RouteHref;
  let element: Element;

  beforeEach(function __setup__() {
    container = new Container();
    routeHref = undefined;
    element = undefined;
  });

  it('constructs', () => {
    [null, undefined, 5, {}, [], Symbol(), function() { }].forEach((v: any) => {
      routeHref = new RouteHref(v, v);
      expect(routeHref.router).toBe(v);
      expect(routeHref.element).toBe(v);
    });
  });

  it('binds', () => {
    const routeHref = new RouteHref(null, null);
    const spy = spyOn(routeHref, 'processChange');
    expect(routeHref.isActive).toBe(undefined);
    routeHref.bind();
    expect(routeHref.isActive).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith();
  });

  it('unbinds', () => {
    const routeHref = new RouteHref(null, null);
    const spy = spyOn(routeHref, 'processChange');
    routeHref.isActive = true;
    routeHref.unbind();
    expect(routeHref.isActive).toBe(false);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('attributeChanged()', () => {
    it('does not remove attribute if previous value is falsy', () => {
      routeHref = new RouteHref(null!, document.createElement('div'));
      routeHref.element.setAttribute('href', '1111');
      routeHref.processChange = () => Promise.resolve();
      [null, undefined, '', 0].forEach((v: any) => {
        routeHref.attributeChanged('href', v);
        expect(routeHref.element.getAttribute('href')).toBe('1111');
      });
    });

    it('handles attribute changed when attached to normal element', async () => {
      const hrefValue = 'AASSSBBBVCVVCC';
      let ensureConfiguredCalled = 0;
      container.registerInstance(Router, {
        ensureConfigured: () => {
          ensureConfiguredCalled++;
          return Promise.resolve();
        },
        generate: () => hrefValue
      });
      container.registerInstance(Element, element = document.createElement('div'));
      routeHref = container.get(RouteHref);
      routeHref.isActive = true;
      (element as any).au = { 'route-href': routeHref };

      const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
      expect(routeHref.attribute).toBe('href');
      routeHref.attributeChanged('href', 'href');
      expect(spy).toHaveBeenCalledTimes(1);
      await wait(100);
      expect(ensureConfiguredCalled).toBe(1);
      expect(routeHref.isActive).toBe(true);
      expect(element.getAttribute('href')).toBe(hrefValue);

      routeHref.attribute = 'link';
      routeHref.attributeChanged('link', 'href');
      expect(element.getAttribute('href')).toBe(null);
      expect(spy).toHaveBeenCalledTimes(2);
      await wait(100);
      expect(ensureConfiguredCalled).toBe(2);
      expect(element.getAttribute('link')).toBe(hrefValue);
    });

    it('handles attribute changed when attached to custom element', async () => {
      const hrefValue = 'AASSSBBBVCVVCC';
      const controller = {
        viewModel: {} as any
      };
      container.registerInstance(Router, {
        ensureConfigured: () => {
          return Promise.resolve();
        },
        generate: () => hrefValue
      });
      container.registerInstance(Element, element = document.createElement('div'));
      routeHref = container.get(RouteHref);
      routeHref.isActive = true;
      (element as any).au = { 'route-href': routeHref, controller };

      const spy = spyOn(RouteHref.prototype, 'processChange').and.callThrough();
      expect(routeHref.attribute).toBe('href');
      routeHref.attributeChanged('href', 'href');
      expect(spy).toHaveBeenCalledTimes(1);
      await wait(100);
      expect(routeHref.isActive).toBe(true);
      expect(controller.viewModel.href).toBe(hrefValue);

      routeHref.attribute = 'link';
      routeHref.attributeChanged('link', 'href');
      expect(element.getAttribute('href')).toBe(null);
      expect(spy).toHaveBeenCalledTimes(2);
      await wait(100);
      expect(controller.viewModel.link).toBe(hrefValue);
    });
  });

  describe('processChanged()', () => {
    it('does nothing if not active', async () => {
      const hrefValue = 'AASSSBBBVCVVCC';
      let ensureConfiguredCalled = 0;
      let generateCalled = 0;
      container.registerInstance(Router, {
        ensureConfigured: () => {
          ensureConfiguredCalled++;
          return Promise.resolve();
        },
        generate: () => {
          generateCalled++;
          return hrefValue;
        }
      });
      container.registerInstance(Element, element = document.createElement('div'));
      routeHref = container.get(RouteHref);
      (element as any).au = { 'route-href': routeHref };

      const promise = routeHref.processChange();
      expect(ensureConfiguredCalled).toBe(1);
      expect(generateCalled).toBe(0);
      await promise;
      expect(generateCalled).toBe(0);
    });

    it('generates Url and set attribute if active', async () => {
      const hrefValue = 'AASSSBBBVCVVCC';
      let ensureConfiguredCalled = 0;
      let generateCalled = 0;
      container.registerInstance(Router, {
        ensureConfigured: () => {
          ensureConfiguredCalled++;
          return Promise.resolve();
        },
        generate: () => {
          generateCalled++;
          return hrefValue;
        }
      });
      container.registerInstance(Element, element = document.createElement('div'));
      routeHref = container.get(RouteHref);
      routeHref.isActive = true;
      (element as any).au = { 'route-href': routeHref };

      await routeHref.processChange();
      expect(ensureConfiguredCalled).toBe(1);
      expect(generateCalled).toBe(1);
      expect(element.getAttribute('href')).toBe(hrefValue);
    });

    it('logs error when things go wrong', async () => {
      const hrefValue = 'AASSSBBBVCVVCC';
      let ensureConfiguredCalled = 0;
      let generateCalled = 0;
      let loggerErrorCalled = 0;
      const error = new Error(hrefValue);
      container.registerInstance(Router, {
        ensureConfigured: () => {
          ensureConfiguredCalled++;
          return Promise.resolve();
        },
        generate: () => {
          generateCalled++;
          throw error;
        }
      });
      container.registerInstance(Element, element = document.createElement('div'));
      routeHref = container.get(RouteHref);
      routeHref.isActive = true;
      (element as any).au = { 'route-href': routeHref };

      const spy = spyOn(Logger.prototype, 'error').and.callFake((ex: any) => {
        loggerErrorCalled = 1;
        expect(ex).toBe(error);
      });

      try {
        await routeHref.processChange();
      } catch {
        expect(1).toBe(0, 'It should have been caught');
      }
      expect(ensureConfiguredCalled).toBe(1);
      expect(generateCalled).toBe(1);
      expect(loggerErrorCalled).toBe(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(element.getAttribute('href')).toBe(null);
    });
  });
});

