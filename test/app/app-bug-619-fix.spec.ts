import './setup';
import { bootstrap } from 'aurelia-bootstrapper';
import { createEntryConfigure, h, removeDebugLogging, addDebugLogging, bootstrapAppWithTimeout, wait, cleanUp, getNormalizedHash } from './utilities';
import { PLATFORM } from 'aurelia-pal';
import { noop } from '../../../aurelia-router/src/constants';

describe('REGRESSION FIXES', () => {

  beforeAll(() => {
    addDebugLogging();
  });

  afterAll(() => {
    removeDebugLogging();
  });

  it('fixes https://github.com/aurelia/router/issues/619 regression', async () => {
    const host = h('div');
    const $aurelia = await bootstrapAppWithTimeout(
      createEntryConfigure(
        PLATFORM.moduleName('bug619/app'),
        host,
        [],
        noop,
        noop,
        /** DO NOT DO AUTO CLEAN UP */false
      ),
      () => console.log('App fix TIMEOUT?????'),
      5000
    );
    expect(location.hash).toBe('');
    document.body.appendChild(host);
    await wait();
    console.log(document.querySelectorAll('a').length);
    document.getElementById('root-a-2').click();
    await wait(250);
    expect(getNormalizedHash()).toBe('#/arrivals/products');

    cleanUp($aurelia);
  });
});
