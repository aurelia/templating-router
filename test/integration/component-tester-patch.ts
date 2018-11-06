import { ComponentTester } from 'aurelia-testing';
import { Aurelia, InlineViewStrategy } from 'aurelia-framework';

let originalCreate = ComponentTester.prototype.create;
export function patchComponentTeser() {
  // we turn create from enhance to setRoot
  // this ensure errors are propagate through properly
  ComponentTester.prototype.create = async function(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void> {
    await bootstrap(async (aurelia: Aurelia) => {
      await this.configure(aurelia);
      if (this['resources']) {
        aurelia.use.globalResources(this['resources']);
      }
      await aurelia.start();
      const host = this['host'] = document.createElement('div');
      const bindingContext = this['bindingContext'];
      // this['host'].innerHTML = this['html'];

      document.body.appendChild(host);
      if (typeof bindingContext === 'object') {
        bindingContext.getViewStrategy = () => {
          return new InlineViewStrategy(this['html']);
        };
      }
      console.log('Setting Root for Aurelia....');
      await aurelia.setRoot(bindingContext, host);
      console.log('Starting');
      const rootView = this['rootView'] = (aurelia as any).root.view;
      this.element = host.firstElementChild as Element;

      if (rootView.controllers.length) {
        this.viewModel = rootView.controllers[0].viewModel;
      }
    });
  };
}

export function unpatchComponentTester() {
  ComponentTester.prototype.create = originalCreate;
}
