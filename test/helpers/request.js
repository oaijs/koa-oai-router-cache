const middleware = require('koa-oai-router-middleware');
const catboxRedis = require('catbox-redis');

const { init } = require('./index');
const cache = require('../..');

async function high(prefix, options = {}, pluginOpts = {}) {
  const { hit, key, value } = pluginOpts;

  const ret = await init({
    apiDoc: `${prefix}/api`,
    plugins: [
      cache,
      middleware,
    ],
    options: {
      middleware: `${prefix}/controllers`,
      cache: {
        engine: catboxRedis,
        options,
        hit,
        key,
        value,
      },
    },
  });

  return ret;
}

async function base(prefix, redisUrl) {
  return high(prefix, { url: redisUrl });
}


module.exports = {
  base,
  high,
};
