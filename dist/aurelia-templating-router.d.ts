import * as LogManager from 'aurelia-logging';
import {
  customAttribute,
  bindable,
  ViewSlot,
  ViewLocator,
  customElement,
  noView,
  BehaviorInstruction,
  CompositionTransaction,
  CompositionEngine,
  ShadowDOM,
  SwapStrategies,
  useView
} from 'aurelia-templating';
import {
  inject,
  Container
} from 'aurelia-dependency-injection';
import {
  Router,
  RouteLoader
} from 'aurelia-router';
import {
  DOM
} from 'aurelia-pal';
import {
  createOverrideContext
} from 'aurelia-binding';
import {
  Origin
} from 'aurelia-metadata';
import {
  relativeToFile
} from 'aurelia-path';
export declare class RouteHref {
  constructor(router?: any, element?: any);
  bind(): any;
  unbind(): any;
  attributeChanged(value?: any, previous?: any): any;
  processChange(): any;
}
export declare class RouterView {
  swapOrder: any;
  layoutView: any;
  layoutViewModel: any;
  layoutModel: any;
  element: any;
  constructor(element?: any, container?: any, viewSlot?: any, router?: any, viewLocator?: any, compositionTransaction?: any, compositionEngine?: any);
  created(owningView?: any): any;
  bind(bindingContext?: any, overrideContext?: any): any;
  process(viewPortInstruction?: any, waitToSwap?: any): any;
  swap(viewPortInstruction?: any): any;
}

/**
* Locator which finds the nearest RouterView, relative to the current dependency injection container.
*/
export declare class RouterViewLocator {
  
  /**
    * Creates an instance of the RouterViewLocator class.
    */
  constructor();
  
  /**
    * Finds the nearest RouterView instance.
    * @returns A promise that will be resolved with the located RouterView instance.
    */
  findNearest(): Promise<RouterView>;
}
export declare class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine?: any);
  loadRoute(router?: any, config?: any): any;
}