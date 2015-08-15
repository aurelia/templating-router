System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "es7.decorators"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "aurelia-templating-router/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
    "aurelia-metadata": "github:aurelia/metadata@0.7.3",
    "aurelia-path": "github:aurelia/path@0.8.1",
    "aurelia-router": "github:aurelia/router@0.11.0",
    "aurelia-templating": "github:aurelia/templating@0.14.0",
    "babel": "npm:babel-core@5.2.2",
    "babel-runtime": "npm:babel-runtime@5.2.2",
    "core-js": "npm:core-js@0.9.18",
    "github:aurelia/binding@0.8.6": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
      "aurelia-metadata": "github:aurelia/metadata@0.7.3",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/dependency-injection@0.9.2": {
      "aurelia-logging": "github:aurelia/logging@0.6.4",
      "aurelia-metadata": "github:aurelia/metadata@0.7.3",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/event-aggregator@0.7.0": {
      "aurelia-logging": "github:aurelia/logging@0.6.4"
    },
    "github:aurelia/loader@0.8.5": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-metadata": "github:aurelia/metadata@0.7.3",
      "aurelia-path": "github:aurelia/path@0.8.1",
      "core-js": "npm:core-js@0.9.18",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.3"
    },
    "github:aurelia/metadata@0.7.3": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/route-recognizer@0.6.2": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/router@0.11.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.7.0",
      "aurelia-history": "github:aurelia/history@0.6.1",
      "aurelia-logging": "github:aurelia/logging@0.6.4",
      "aurelia-path": "github:aurelia/path@0.8.1",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.6.2",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating@0.14.0": {
      "aurelia-binding": "github:aurelia/binding@0.8.6",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.2",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.8.5",
      "aurelia-logging": "github:aurelia/logging@0.6.4",
      "aurelia-metadata": "github:aurelia/metadata@0.7.3",
      "aurelia-path": "github:aurelia/path@0.8.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.2",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
