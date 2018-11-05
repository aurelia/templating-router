/// <reference path="./html.d.ts" />
import { Container } from 'aurelia-dependency-injection';
import { Router } from 'aurelia-router';
import { CompositionContext, Controller, HtmlBehaviorResource } from 'aurelia-templating';
import { PLATFORM } from 'aurelia-pal';


require.context('./routes', true, /\.(?:ts|html)$/im);
// require.context('./dynamic-import-routes')

export interface IAureliaElement extends Element {
  au?: any;
}

export interface IFrameworkConfiguration {
  container: Container;
  singleton(...args: any[]): this;
  globalResources(...args: any[]): this;
}

/**@internal */
declare module 'aurelia-dependency-injection' {

  interface Container {
    viewModel?: any;
    getChildRouter?(): Router;
  }
}

/**@internal */
declare module 'aurelia-templating' {
  interface CompositionContext {
    router?: Router;
  }

  interface View {
    // not correct but works fine enough
    children: View[];

    slots: Record<string, any>;
  }

  interface CompositionTransaction {
    initialComposition?: boolean;
  }

  interface ResourceDescription {
    value: Function;
    metadata: HtmlBehaviorResource;
  }

  interface Controller {
    slots: Record<string, any>;
  }

  interface ViewStrategy {
    makeRelativeTo(moduleId: string): void;
  }
}

/**@internal */
declare module 'aurelia-router' {
  interface ViewPortComponent extends CompositionContext {
    // container?: Container;
  }

  interface ViewPortInstruction {
    controller: Controller;
    layoutInstruction: {
      viewModel: any;
      model: any;
      view: any;
    };
  }
}
