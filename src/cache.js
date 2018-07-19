const assert = require('assert');
const debug = require('debug')('koa-oai-router:cache');
const groupBy = require('lodash.groupby');
const Router = require('koa-oai-router');

const {
  getHit,
  getUidBuilder,
  getKeyBuilder,
  getValueBuilder,
} = require('./options');
const Storage = require('./storage');

const { Plugin } = Router;

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
class CachePlugin extends Plugin {
  constructor() {
    super();

    this.pluginName = 'cache';
    this.field = 'x-oai-cache';
  }

  async init() {
    const {
      engine,
      options,
    } = this.args || {};

    this.client = new Storage(engine, options);

    await this.client.start();
  }

  async handler(docOpts) {
    const args = this.args || {};

    assert(typeof args === 'object', 'args must be object');
    assert(typeof args.engine === 'function', 'args.engine must be object');

    const {
      fieldValue,
      operation,
      operationValue,
    } = docOpts;
    const { uid: enableUid = false } = fieldValue;
    const { parameters } = operationValue;

    const {
      hit: originalHit,
      uid: uidBuilder = getUidBuilder,
      key: keyBuilder = getKeyBuilder,
      keyInParameters = true,
      value: valueBuilder = getValueBuilder,
    } = args;
    const hit = getHit(originalHit);

    const schemas = groupBy(parameters, 'in');


    debug('config', docOpts);

    return async (ctx, next) => {
      if (operation.toLowerCase() !== 'get') {
        await next();
        return;
      }

      const cacheKey = await keyBuilder(ctx, keyInParameters, schemas);
      if (enableUid) {
        const uid = await uidBuilder(ctx);
        cacheKey.id = `${uid}___${cacheKey.id}`;
      }

      const cachedValue = await this.client.getCacheData(cacheKey, fieldValue);
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
      await this.client.setCacheData(cacheKey, newValue, fieldValue);

      debug('newCache', cacheKey);
      debug('newCacheValue', newValue);
    };
  }
}

module.exports = CachePlugin;
