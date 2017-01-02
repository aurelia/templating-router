import {inject} from 'aurelia-dependency-injection';
import {testConstants} from '../test/test-constants';
import {RouterViewLocator, RouterView} from 'src/router-view';

@inject(RouterViewLocator)
export class LayoutDefaultSlot {
  constants = testConstants;

  constructor(routerViewLocator) {
    routerViewLocator.findNearest().then(routerView => {
      if (!this.activated && routerView instanceof RouterView) {
        this.routerViewLocated = true;
      }
    });
  }

  activate(value) {
    this.activated = true;
    this.value = value;
  }
}
