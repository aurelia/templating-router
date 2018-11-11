import { Container } from 'aurelia-dependency-injection';
import { Router, ViewPortInstruction } from 'aurelia-router';
import { CompositionContext, Controller } from 'aurelia-templating';

export interface IFrameworkConfiguration {
  container: Container;
  singleton(...args: any[]): this;
  globalResources(...args: any[]): this;
}

/**@internal */
declare module 'aurelia-dependency-injection' {

  interface Container {
    viewModel?: any;
    getChildRouter(): Router;
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

export interface IRouterViewViewPortInstruction extends ViewPortInstruction {
  controller?: Controller;
  layoutInstruction?: {
    viewModel: any;
    model: any;
    view: any;
  };
}
