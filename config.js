System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.1.0",
    "aurelia-router": "github:aurelia/router@0.1.0",
    "aurelia-templating": "github:aurelia/templating@0.2.0",
    "github:aurelia/binding@0.1.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.1.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.1.0"
    },
    "github:aurelia/dependency-injection@0.1.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.1.0",
      "es6-shim": "github:paulmillr/es6-shim@0.21.1"
    },
    "github:aurelia/loader@0.1.1": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.0",
      "aurelia-path": "github:aurelia/path@0.1.0",
      "es6-shim": "github:paulmillr/es6-shim@0.21.1",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.5.2"
    },
    "github:aurelia/router@0.1.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.1.0",
      "aurelia-history": "github:aurelia/history@0.1.0",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.1.0",
      "es6-shim": "github:paulmillr/es6-shim@0.21.1"
    },
    "github:aurelia/templating@0.2.0": {
      "aurelia-binding": "github:aurelia/binding@0.1.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.1.0",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.0",
      "aurelia-loader": "github:aurelia/loader@0.1.1",
      "aurelia-logging": "github:aurelia/logging@0.1.0",
      "aurelia-metadata": "github:aurelia/metadata@0.1.0",
      "aurelia-path": "github:aurelia/path@0.1.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.1.0",
      "es6-shim": "github:paulmillr/es6-shim@0.21.1"
    }
  }
});

