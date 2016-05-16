import {StageComponent} from 'aurelia-testing';
import {RouteLoader, AppRouter, Router} from 'aurelia-router';
import {TemplatingRouteLoader} from 'src/route-loader';

describe('router-view', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
        .withResources('src/router-view')
        .inView('<router-view></router-view>');

    component.bootstrap(aurelia => {
      aurelia.use.defaultBindingLanguage()
                .defaultResources()
                .history();

      aurelia.use.singleton(RouteLoader, TemplatingRouteLoader)
                 .singleton(Router, AppRouter)
                 .globalResources('src/router-view', 'src/route-href');

      aurelia.use.container.registerAlias(Router, AppRouter);

      aurelia.use.container.viewModel = {
        configureRouter: (config, router) => {
          config.map([
            { route: '', name: 'base-route',    moduleId: 'test/default', title: 'Default route' },
            { route: 'nolayout', name: 'nolayout',    moduleId: 'test/page1', title: 'No layout' },
            { route: 'layout1',  name: 'testlayout1', moduleId: 'test/page2', title: 'Test Layout 1', layoutView: 'test/test-layout.html' },
            { route: 'layout2',  name: 'testlayout2', moduleId: 'test/page3', title: 'Test Layout 2', layoutViewModel: 'test/test-layout' }
          ]);
        }
      };
    });
  });

  afterEach(done => {
    Promise.resolve(component.viewModel.router.navigate(''))
    .then(() => {
      component.dispose();
      done();
    });
  });

  it('has a router instance', done => {
    component.create()
    .then(() => {
      expect(component.viewModel.router).not.toBe(undefined);
    })
    .then(done);
  });

  it('loads a non-layout based view', done => {
    component.create()
    .then(() => {
      return component.viewModel.router.navigate('nolayout');
    })
    .then(() => {
      expect(component.viewModel.element.innerText).toBe('This is page 1');
    })
    .then(done);
  });

  it('loads a view-only layout', done => {
    component.create()
    .then(() => {
      return component.viewModel.router.navigate('layout1');
    })
    .then(() => {
      expect(component.viewModel.element.innerText).toBe('test layout\n\nThis is page 2');
    })
    .then(done);
  });

  it('loads a module based layout', done => {
    component.create()
    .then(() => {
      return component.viewModel.router.navigate('layout2');
    })
    .then(() => {
      expect(component.viewModel.element.innerText).toBe('test layout\n\nThis is page 3');
    })
    .then(done);
  });
});
