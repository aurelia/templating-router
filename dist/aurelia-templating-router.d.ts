// Generated by dts-bundle-generator v6.7.0

import { OverrideContext } from 'aurelia-binding';
import { Container } from 'aurelia-dependency-injection';
import { NavigationInstruction, RouteConfig, RouteLoader, Router } from 'aurelia-router';
import { CompositionEngine, CompositionTransaction, View, ViewLocator, ViewSlot } from 'aurelia-templating';

/**
 * Default implementation of `RouteLoader` used for loading component based on a route config
 */
export declare class TemplatingRouteLoader extends RouteLoader {
	constructor(compositionEngine: CompositionEngine);
	/**
	 * Load corresponding component of a route config of a navigation instruction
	 */
	loadRoute(router: Router, config: RouteConfig, navInstruction: NavigationInstruction): Promise<any>;
}
/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
export declare class RouterView {
	/**
	 * Swapping order when going to a new route. By default, supports 3 value: before, after, with
	 * - before = new in -> old out
	 * - after = old out -> new in
	 * - with = new in + old out
	 *
	 * These values are defined by swapStrategies export in aurelia-templating/ aurelia-framework
	 * Can be extended there and used here
	 */
	swapOrder?: "before" | "after" | "with";
	/**
	 * Layout view used for this router-view layout, if no layout-viewmodel specified
	 */
	layoutView?: any;
	/**
	 * Layout view model used as binding context for this router-view layout
	 * Actual type would be {string | Constructable | object}
	 */
	layoutViewModel?: any;
	/**
	 * Layout model used to activate layout view model, if specified with `layoutViewModel`
	 */
	layoutModel?: any;
	/**
	 * Element associated with this <router-view/> custom element
	 */
	readonly element: Element;
	/**
	 * Current router associated with this <router-view/>
	 */
	readonly router: Router;
	/**
	 * Container at this <router-view/> level
	 */
	container: Container;
	constructor(element: Element, container: Container, viewSlot: ViewSlot, router: Router, viewLocator: ViewLocator, compositionTransaction: CompositionTransaction, compositionEngine: CompositionEngine);
	created(owningView: View): void;
	bind(bindingContext: any, overrideContext: OverrideContext): void;
	/**
	 * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
	 */
	process($viewPortInstruction: any, waitToSwap?: boolean): Promise<void>;
	swap($viewPortInstruction: any): void | Promise<void>;
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
/**
 * Helper custom attribute to help associate an element with a route by name
 */
export declare class RouteHref {
	/**
	 * Current router of this attribute
	 */
	readonly router: Router;
	/**
	 * Element this attribute is associated with
	 */
	readonly element: Element;
	/**
	 * Name of the route this attribute refers to. This name should exist in the current router hierarchy
	 */
	route: string;
	/**
	 * Parameters of this attribute to generate URL.
	 */
	params: Record<string, any>;
	/**
	 * Target property on a custom element if this attribute is put on a custom element
	 * OR an attribute if this attribute is put on a normal element
	 */
	attribute: string;
	constructor(router: Router, element: Element);
	bind(): void;
	unbind(): void;
	attributeChanged(value: any, previous: any): Promise<void>;
	processChange(): Promise<void>;
}
export interface IFrameworkConfiguration {
	container: Container;
	singleton(...args: any[]): this;
	globalResources(...args: any[]): this;
}
export declare function configure(config: IFrameworkConfiguration): void;

export {};
