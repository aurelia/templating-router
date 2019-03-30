import 'aurelia-polyfills';
import 'aurelia-loader-webpack';
import {initialize} from 'aurelia-pal-browser';
import { PLATFORM } from 'aurelia-pal';

PLATFORM.moduleName('test/routes/route-1');
PLATFORM.moduleName('test/routes/route-2');
PLATFORM.moduleName('test/routes/layout-1');
PLATFORM.moduleName('test/routes/layout-2');
PLATFORM.moduleName('test/routes/multiple-slots-route-1');
PLATFORM.moduleName('test/routes/multiple-slots-layout-1');

initialize();
