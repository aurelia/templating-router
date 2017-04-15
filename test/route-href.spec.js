import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('route-href', () => {
  it('should use route as primary property', done => {
    let component = StageComponent
      .withResources()
      .inView('<a route-href.bind="link"></a>')
      .boundTo({ link: 'home' });
    
    component
      .create(bootstrap)
      .then((aurelia) => {
        expect(component.viewModel.route).toBe('home');
        done();
        component.dispose();
      }).catch(e => {
        fail(e);
        component.dispose();
      });
  });
});