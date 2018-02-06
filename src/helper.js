const _serialize = require('serialize-javascript');
const _readall = require('readall');
const vm = require('vm');
const debug = require('debug')('koa-oai-router:cache:helper');

/**
 * Readall stream
 * @param {object} stream
 */
function readall(stream) {
  return new Promise((resolve, reject) => {
    _readall(stream, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Deserialize string to {type, primitive, data}
 * @param {string} serialized serialized string.
 * @returns {object} {type, primitive, data}
 */
function deserialize(serialized) {
  debug('deserialize', serialized);

  const ret = vm.runInThisContext(`(${serialized})`, { timeout: 5000 });

  if (ret.primitive === 'buffer') {
    ret.data = Buffer.from(ret.data, 'hex');
  }

  return ret;
}

/**
 * Serialize {type, primitive, data}
 * @param {string} type content-type
 * @param {object} value cache value
 * @returns {object} {type, primitive, data}
 */
function serialize({ type, value }) {
  let data = value;
  const primitive = Buffer.isBuffer(value) ? 'buffer' : typeof value;

  if (primitive === 'buffer') {
    data = value.toString('hex');
  }

  const ret = _serialize({ type, primitive, data });

  return ret;
}

module.exports = {
  readall,
  serialize,
  deserialize,
};
