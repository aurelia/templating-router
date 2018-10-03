import { Aurelia } from 'aurelia-framework';
import 'aurelia-loader-webpack';

export function bootstrap(config: (aurelia: Aurelia) => Promise<void>): Promise<void> {
  return Promise.resolve().then(() => Promise.resolve(config(new Aurelia())).then(() => {}));;
}
