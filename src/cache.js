const assert = require('assert');
const debug = require('debug')('koa-oai-router:cache');
const Router = require('koa-oai-router');

const { getHit, getKeyBuilder, getValueBuilder } = require('./options');
const Storage = require('./storage');

const { Plugin } = Router;

function middlewareWrapper(middlewareOpts, middlewareArgs) {
  assert(typeof middlewareArgs === 'object', 'middlewareArgs must be object');
  assert(typeof middlewareArgs.engine === 'function', 'middlewareArgs.engine must be object');

  const {
    fieldValue,
    operation,
  } = middlewareOpts;

  const {
    engine,
    options,
    hit: originalHit,
    key: keyBuilder = getKeyBuilder,
    value: valueBuilder = getValueBuilder,
  } = middlewareArgs;
  const hit = getHit(originalHit);

  const client = new Storage(engine, options);
  debug('config', middlewareOpts);

  return async (ctx, next) => {
    if (operation.toLowerCase() !== 'get') {
      await next();
      return;
    }

    const cacheKey = await keyBuilder(ctx);
    const cachedValue = await client.getCacheData(cacheKey);
    debug('cacheKey:', cacheKey);
    debug('cachedValue:', cachedValue);

    // Cache hit, response to client.
    if (cachedValue !== null) {
      ctx.response.status = 200;
      ctx.response.type = cachedValue.type;
      ctx.response.body = cachedValue.data;

      if (hit !== null) ctx.response.set(hit, 'true');
      return;
    }

    await next();

    if (ctx.response.status !== 200) return;

    // Cache success response.
    const newValue = await valueBuilder(ctx);
    client.setCacheData(cacheKey, newValue, fieldValue);

    debug('newCache', cacheKey);
    debug('newCacheValue', newValue);
  };
}

/**
 * Cache plugin for api
 * @param {object} args
 * @param {object} engine k-v engine instance
 * @param {object} options options of engine
 * @param {boolean|string} hit `false` not response header.
 *  `true` responses header 'x-oai-hit': true.
 *  `string` response header with custom key.
 * @param {function} key cache key builder. having args (ctx) and must return {id, segment}
 * @param {function} value cache value builder. having args (ctx) and must return {type, value}
 */
function plugin(args) {
  return new Plugin({
    name: 'cache',
    field: 'x-oai-cache',
    middlewareArgs: args,
    middlewareWrapper,
  });
}

module.exports = plugin;
