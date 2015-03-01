System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-templating-router/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.5",
    "aurelia-metadata": "github:aurelia/metadata@0.3.3",
    "aurelia-path": "github:aurelia/path@0.4.5",
    "aurelia-router": "github:aurelia/router@0.5.8",
    "aurelia-templating": "github:aurelia/templating@0.8.14",
    "github:aurelia/binding@0.3.7": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.5",
      "aurelia-metadata": "github:aurelia/metadata@0.3.3",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.5"
    },
    "github:aurelia/dependency-injection@0.4.5": {
      "aurelia-metadata": "github:aurelia/metadata@0.3.3",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/loader@0.3.5": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.3",
      "core-js": "npm:core-js@0.4.10",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.5.5"
    },
    "github:aurelia/router@0.5.8": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.5",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.2.4",
      "aurelia-history": "github:aurelia/history@0.2.4",
      "aurelia-path": "github:aurelia/path@0.4.5",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.2.4",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/templating@0.8.14": {
      "aurelia-binding": "github:aurelia/binding@0.3.7",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.4.5",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.1.3",
      "aurelia-loader": "github:aurelia/loader@0.3.5",
      "aurelia-logging": "github:aurelia/logging@0.2.5",
      "aurelia-metadata": "github:aurelia/metadata@0.3.3",
      "aurelia-path": "github:aurelia/path@0.4.5",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.5",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.0"
    },
    "npm:core-js@0.4.10": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

