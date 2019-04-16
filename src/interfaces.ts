import { Container } from 'aurelia-dependency-injection';
import { Router, RouteConfig, NavigationInstruction } from 'aurelia-router';
import { Controller } from 'aurelia-templating';

export type Constructable<T = any> = new (...args: any[]) => T;

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


/**
 * The component responsible for routing
 */
export interface ViewPortComponent {
  viewModel: any;
  childContainer?: Container;
  router: Router;
  config?: RouteConfig;
  childRouter?: Router;
  /**
   * This is for backward compat, when moving from any to a more strongly typed interface
   */
  [key: string]: any;
}


export interface ViewPortInstruction {

  name?: string;

  strategy: 'no-change' | 'invoke-lifecycle' | 'replace';

  childNavigationInstruction?: NavigationInstruction;

  moduleId: string;

  component: ViewPortComponent;

  childRouter?: Router;

  lifecycleArgs: [Record<string, string>, RouteConfig, NavigationInstruction];

  prevComponent?: ViewPortComponent;
}

export interface ViewPort {
  /**@internal */
  container: Container;
  swap(viewportInstruction: ViewPortInstruction): void;
  process(viewportInstruction: ViewPortInstruction, waitToSwap?: boolean): Promise<void>;
}

export interface IRouterViewViewPortInstruction extends ViewPortInstruction {
  controller?: Controller;
  layoutInstruction?: {
    viewModel: any;
    model: any;
    view: any;
  };
}
