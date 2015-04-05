import {inject} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {RouteLoader, Router} from 'aurelia-router';
import {relativeToFile} from 'aurelia-path';
import {Origin} from 'aurelia-metadata';

@inject(CompositionEngine)
export class TemplatingRouteLoader extends RouteLoader {
  constructor(compositionEngine){
    super();
    this.compositionEngine = compositionEngine;
  }

  loadRoute(router, config){
    var childContainer = router.container.createChild(),
        instruction = {
          viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
          childContainer:childContainer,
          view:config.view || config.viewStrategy
        },
        childRouter;

    childContainer.registerHandler(Router, c => {
      return childRouter || (childRouter = router.createChild(childContainer));
    });

    return this.compositionEngine.createViewModel(instruction).then(instruction => {
      instruction.executionContext = instruction.viewModel;
      instruction.router = router;
      return instruction;
    });
  }
}
