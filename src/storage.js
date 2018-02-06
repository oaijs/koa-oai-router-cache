const debug = require('debug')('koa-oai-router:cache:storage');
const timestring = require('timestring');
const { inherits } = require('util');
const { Client } = require('catbox');
const {
  serialize, deserialize,
} = require('./helper');

function Storage(engine, options) {
  this.client = new Client(engine, options);
}

Storage.prototype.start = async function name() {
  await this.client.start();
};

/**
 * Get cached value.
 * @param {object} client cache service
 * @param {string} key cache key
 * @returns {null|object}
 */
Storage.prototype.getCacheData = async function getCacheData(key) {
  debug('getCacheData', key);

  const cachedValue = await this.client.get(key);

  if (cachedValue !== null) {
    return deserialize(cachedValue.item);
  }

  return null;
};

/**
 * Set value cached with key.
 * @param {object} client cache client
 * @param {string} key cache key
 * @param {any} value value to cache
 * @param {object} options
 * @param {boolean} options.enable enable or disable cache.
 * @param {string} options.expire cache value ttl.
 */
Storage.prototype.setCacheData = async function setCacheData(key, value, options) {
  const {
    expire,
    enable = true,
  } = options;
  let ttl = expire;

  if (enable !== true) {
    return;
  }

  // Save to cache later.
  process.nextTick(async () => {
    if (Number.isNaN(+expire)) {
      ttl = timestring(expire, 'ms');
    }

    const serializedValue = serialize(value);
    debug(`setCacheData ${JSON.stringify(key)} ${serializedValue} ${JSON.stringify(options)}`);

    await this.client.set(key, serializedValue, Number(ttl));
  });
};

inherits(Client, Storage);

module.exports = Storage;
