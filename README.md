<p>
  <a href="https://aurelia.io/" target="_blank">
    <img alt="Aurelia" src="https://aurelia.io/styles/images/aurelia.svg">
  </a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm Version](https://img.shields.io/npm/v/aurelia-templating-router.svg)](https://www.npmjs.com/package/aurelia-templating-router)
![ci](https://github.com/aurelia/templating-router/actions/workflows/main.yml/badge.svg)
[![Discourse status](https://img.shields.io/discourse/https/meta.discourse.org/status.svg)](https://discourse.aurelia.io)
[![Twitter](https://img.shields.io/twitter/follow/aureliaeffect.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=aureliaeffect)
[![Discord Chat](https://img.shields.io/discord/448698263508615178.svg)](https://discord.gg/RBtyM6u)

# aurelia-templating-router

## Platform Support

This library can be used in the **browser** only.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```

3. To build the code, you can now run:

  ```shell
  npm run build
  ```

4. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.


## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm run test
  ```

2. With watch options to rerun the test (headless):

  ```
  npm run test:watch
  ```

3. With watch options to rerun the test (with browser):

  ```
  npm run test:debugger
  ```
