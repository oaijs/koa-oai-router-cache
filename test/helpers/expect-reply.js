
async function expectInternal(request, api, hit = 'x-oai-hit', first, second, status = 200) {
  const name = Math.random();
  await request
    .get(api)
    .query({ name })
    .expect(status)
    .expect((res) => {
      expect(res.headers[hit]).toBe(first);
    });

  await request
    .get(api)
    .query({ name })
    .expect(status)
    .expect((res) => {
      expect(res.headers[hit]).toBe(second);
    });
}

async function exepectRelyNotCached(request, api, hit) {
  return expectInternal(request, api, hit, undefined, undefined);
}

async function exepectRelyCached(request, api, hit) {
  return expectInternal(request, api, hit, undefined, 'true');
}

async function exepectRelyNotCachedWithStatus(request, api, hit, status) {
  return expectInternal(request, api, hit, undefined, undefined, status);
}

module.exports = {
  exepectRelyCached,
  exepectRelyNotCached,
  exepectRelyNotCachedWithStatus,
};
