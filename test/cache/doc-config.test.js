const { base } = require('../helpers/request');
const { exepectRelyCached, exepectRelyNotCached } = require('../helpers/expect-reply');

describe('cache field config', () => {
  it('enable false, expire 1000, should success', async () => {
    const { request } = await base('./test/cache', 'redis://127.0.0.1:6379');

    await exepectRelyNotCached(request, '/api/pets-enable-false');
  });
});
