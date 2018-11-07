import './setup';
import { RouterViewLocator } from '../../src/router-view';
import { wait } from './utilities';

fdescribe('RouterView -- UNIT', () => {

  describe('RouterViewLocator', () => {
    it('locates what is notified', async () => {
      const notWaited = {};
      const promises = [];
      const values = [null, undefined, 5, '', {}, [], Symbol(), function() { }];
      for (const v of values) {
        const locator = new RouterViewLocator();
        promises.push(Promise.race([
          wait(100).then(() => notWaited),
          locator.findNearest()
        ]));
      }
      let results = await Promise.all(promises);
      expect(results.every(e => e === notWaited)).toBe(true);

      promises.length = 0;
      for (const v of values) {
        const locator = new RouterViewLocator();
        promises.push(Promise.race([
          wait(100).then(() => notWaited),
          locator.findNearest()
        ]));
        locator._notify(v as any);
      }
      results = await Promise.all(promises);
      expect(results.every((e, idx) => e === values[idx])).toBe(true);
    });
  });
});
