import {StageComponent} from 'aurelia-testing';
import {RouteLoader, AppRouter, Router, RouteConfig, RouterConfiguration} from 'aurelia-router';
import {TemplatingRouteLoader} from 'src/route-loader';
import {testConstants} from 'test/test-constants';
import {bootstrap} from 'aurelia-bootstrapper';
import { inlineView } from 'aurelia-templating';

describe('router-view', () => {
  /**@type {StageComponent} */
  let component;

  beforeEach(done => {
    done();
  });

  afterEach(done => {
    component.viewModel.router.navigate('default').then(() => {
      component.dispose();
      done();
    });
  });

  it('has a router instance', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot' });

    component.create(bootstrap)
      .then(() => {
        expect(component.viewModel.router).not.toBe(undefined);
      })
      .then(done);
  });

  it('loads a non-layout based view', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content);
      })
      .then(done);
  });

  it('loads a view-only layout', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot', layoutView: 'test/layout-default-slot.html' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content);
        expect(component.viewModel.element.innerText).toContain(testConstants.defaultLayout);
      })
      .then(done);
  });

  it('loads a view-only module', done =>{
    component = withDefaultViewport({ moduleId: 'test/module-view-only.html' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain('view-only content');
      })
      .then(done);
  });

  it('loads a module based layout', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot', layoutViewModel: 'test/layout-default-slot' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content);
        expect(component.viewModel.element.innerText).toContain(testConstants.defaultLayout);
        expect(component.viewModel.viewSlot.children[0].controller.viewModel).not.toBe(undefined);
      })
      .then(done);
  });

  it('loads a module based layout with a specific view', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot', layoutView: 'test/layout-default-slot-alt.html', layoutViewModel: 'test/layout-default-slot' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content);
        expect(component.viewModel.element.innerText).toContain(testConstants.altLayout);
        expect(component.viewModel.viewSlot.children[0].controller.viewModel).not.toBe(undefined);
      })
      .then(done);
  });

  it('loads a layout with multiple slots', done => {
    component = withDefaultViewport({ moduleId: 'test/module-named-slots', layoutView: 'test/layout-named-slots.html' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content + '\n' + testConstants.content);
        expect(component.viewModel.element.innerText).toContain(testConstants.namedSlotsLayout);
      })
      .then(done);
  });

  it('loads layouts for a named viewport', done => {
    component = withNamedViewport({
      viewPorts: {
        viewport1: { moduleId: 'test/module-default-slot', layoutView: 'test/layout-default-slot.html' }
      }
    });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.element.innerText).toContain(testConstants.content);
        expect(component.viewModel.element.innerText).toContain(testConstants.defaultLayout);
      })
      .then(done);
  });

  it('activates the layout viewmodel with a model value', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot', layoutViewModel: 'test/layout-default-slot', layoutModel: 1 });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.viewSlot.children[0].controller.viewModel.value).toBe(1);
      })
      .then(done);
  });

  it('locates the view port before activating', done => {
    component = withDefaultViewport({ moduleId: 'test/module-default-slot', layoutViewModel: 'test/layout-default-slot' });

    component.create(bootstrap)
      .then(() => {
        return component.viewModel.router.navigate('route').then(wait);
      })
      .then(() => {
        expect(component.viewModel.viewSlot.children[0].controller.viewModel.routerViewLocated).toBe(true);
      })
      .then(done);
  });

  describe('classes as module id', () => {
    it('uses class for route module id', (done) => {
      @inlineView('<template><span class="route-1">This is route 1</span></template>')
      class Route {}

      component = withDefaultViewport({ moduleId: Route });
      
      component.create(bootstrap)
        .then(() => {
          return component.viewModel.router.navigate('route').then(wait);
        })
        .then(() => {
          expect(document.querySelector('.route-1')).toBeDefined();
        })
        .then(done);
    });

    it('uses class for route module id in view port', done => {
      @inlineView('<template><span class="route-1">This is route 1</span></template>')
      class Route {}

      component = withNamedViewport({
        viewPorts: {
          viewport1: { moduleId: Route, layoutView: 'test/layout-default-slot.html' }
        }
      });

      component.create(bootstrap)
        .then(() => {
          return component.viewModel.router.navigate('route').then(wait);
        })
        .then(() => {
          expect(document.querySelectorAll('.route-1').length).toBe(1);
        })
        .then(done);
    });
  });
});

function wait() {
  return new Promise(res => setTimeout(() => res(), 250));
}

/**
 * @param {RouteConfig} routeConfig
 */
function withDefaultViewport(routeConfig) {
  let component = StageComponent
      .withResources('src/router-view')
      .inView('<router-view></router-view>');

  configure(component, {
    route: ['', 'default'],
    moduleId: 'test/module-default-slot',
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

/**
 * @param {RouteConfig} routeConfig
 */
function withNamedViewport(routeConfig) {
  let component = StageComponent
      .withResources('src/router-view')
      .inView('<router-view name="viewport1"></router-view>');

  configure(component, {
    route: ['', 'default'],
    viewPorts: {
      viewport1: { moduleId: 'test/module-default-slot' }
    },
    activationStrategy: 'replace'
  }, routeConfig);

  return component;
}

/**
 * @param {StageComponent} component
 * @param {RouteConfig} defaultRoute
 * @param {RouteConfig} routeConfig
 */
function configure(component, defaultRoute, routeConfig) {
  component.bootstrap(aurelia => {
    aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .history();

    aurelia.use
      .singleton(RouteLoader, TemplatingRouteLoader)
      .singleton(Router, AppRouter)
      .globalResources('src/router-view', 'src/route-href');

    if (routeConfig) {
      routeConfig.activationStrategy = 'replace';
      routeConfig.route = 'route';
      routeConfig = [defaultRoute, routeConfig];
    } else {
      routeConfig = [defaultRoute];
    }

    aurelia.use.container.viewModel = {
      configureRouter: (config, router) => {
        config.map(routeConfig);
      }
    };
  });
}
