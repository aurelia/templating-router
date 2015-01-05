import {ResourceCoordinator} from 'aurelia-templating';
import {RouteLoader} from 'aurelia-router';

export class TemplatingRouteLoader extends RouteLoader {
  static inject(){ return [ResourceCoordinator]; }
  constructor(resourceCoordinator){
    this.resourceCoordinator = resourceCoordinator;
  }

  loadRoute(config){
    return this.resourceCoordinator.loadViewModelInfo(config.moduleId);
  }
}