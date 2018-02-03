
const { base } = require('../helpers/request');
const { exepectRelyCached, exepectRelyNotCachedWithStatus } = require('../helpers/expect-reply');

describe('cache reply types', () => {
  it('post not cached, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    const name = Math.random();
    const api = '/api/pets-string';
    await request
      .post(api)
      .query({ name })
      .expect(200);

    await request
      .get(api)
      .query({ name })
      .expect(200);
  });

  it('response body is string, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-string');
  });

  it('response body is object, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-object');
  });

  it('response body is number, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-number');
  });

  it('response body is buffer, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-buffer');
  });

  it('response body is stream, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-stream');
  });

  it('response is 400, should not cached', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyNotCachedWithStatus(request, '/api/pets-400', null, 400);
  });

  it('response is no-content-type, should not cached', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-no-content-type');
  });

  it('response is throw, should not cached', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyNotCachedWithStatus(request, '/api/pets-throw', null, 500);
  });

  it('response stream invalid, should not cached', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyNotCachedWithStatus(request, '/api/pets-stream-invalid', null, 500);
  });
});
