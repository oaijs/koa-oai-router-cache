const { base } = require('../helpers/request');
const { exepectRelyNotCached, exepectRelyCached } = require('../helpers/expect-reply');

describe('cache field config', () => {
  it('enable false, expire 1000, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyNotCached(request, '/api/pets-enable-false');
  });

  it('memory true, expire 1000, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyCached(request, '/api/pets-memory-true');
  });
});
