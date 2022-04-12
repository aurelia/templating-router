
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./html.d.ts" />
import { Container } from 'aurelia-dependency-injection';
import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

export function addDebugLogging() {
  const appenders = LogManager.getAppenders();
  if (!appenders || !appenders.length) {
    LogManager.setLevel(LogManager.logLevel.error);
    LogManager.addAppender(new ConsoleAppender());
  }
}

export function removeDebugLogging() {
  LogManager.clearAppenders();
}

export interface IAureliaElement extends Element {
  au?: any;
}

export interface IFrameworkConfiguration {
  container: Container;
  singleton(...args: any[]): this;
  globalResources(...args: any[]): this;
}
