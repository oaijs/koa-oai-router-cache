const { high } = require('../helpers/request');
const { exepectRelyCached, exepectRelyNotCached } = require('../helpers/expect-reply');

describe('cache plugin config', () => {
  it('DEBUG=true, should success', async () => {
    process.env.DEBUG = true;

    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: false,
      });

    await exepectRelyNotCached(request, '/api/pets-enable-false');
  });

  it('hit false, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: false,
      });

    await exepectRelyNotCached(request, '/api/pets-enable-false');
  });

  it('hit true, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: true,
      });

    await exepectRelyNotCached(request, '/api/pets-enable-false');
  });

  it('hit true, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: true,
      });

    await exepectRelyCached(request, '/api/pets-enable-true');
  });

  it('hit xxoo, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: 'xxoo',
      });

    await exepectRelyCached(request, '/api/pets-enable-true', 'xxoo');
  });

  it('hit invalid type, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        hit: {},
      });

    await exepectRelyNotCached(request, '/api/pets-enable-true');
  });

  it('uid function set, should success', async () => {
    const { request } = await high(
      './test/cache', {
        url: 'redis://127.0.0.1:6379',
      }, {
        uid: (ctx) => {
          return '123';
        },
      });

    await exepectRelyCached(request, '/api/pets-uid-true');
  });
});
