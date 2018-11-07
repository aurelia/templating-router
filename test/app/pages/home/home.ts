import { inject } from 'aurelia-framework';
import { ILifeCyclesAssertions, invokeAssertions } from '../../utilities';

@inject(Element, 'pages/home/home')
export class Home {

  constructor(
    public element: Element,
    public lifecycleCallbacks: ILifeCyclesAssertions
  ) {
    invokeAssertions(this, 'construct');
  }

  attached() {
    invokeAssertions(this, 'attached');
  }
}
