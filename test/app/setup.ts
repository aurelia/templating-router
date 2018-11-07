import 'aurelia-polyfills';
import 'aurelia-loader-webpack';
import { initialize } from 'aurelia-pal-browser';

initialize();

require.context('./pages', true, /\.(?:html|ts)/im);
require.context('./resources', true, /\.(?:html|ts)/im);
