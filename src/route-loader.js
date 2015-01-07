import {CompositionEngine} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';

export class TemplatingRouteLoader extends RouteLoader {
  static inject(){ return [CompositionEngine]; }
  constructor(compositionEngine){
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config){
    var childContainer = router.container.createChild(),
        instruction = { viewModel:config.moduleId, childContainer:childContainer },
        childRouter;

    childContainer.registerHandler(Router, c => { 
      return childRouter || (childRouter = router.createChild(childContainer)); 
    });

    return this.compositionEngine.createViewModel(instruction).then(instruction => {
      instruction.executionContext = instruction.viewModel;
      return instruction;
    });
  }
}