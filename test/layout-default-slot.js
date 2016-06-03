import {testConstants} from '../test/test-constants';

export class LayoutDefaultSlot {
  constants = testConstants;

  activate(value) {
    this.value = value;
  }
}
