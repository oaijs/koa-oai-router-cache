const _serialize = require('serialize-javascript');
const _readall = require('readall');
const perfy = require('perfy');
const vm = require('vm');
const debug = require('debug')('koa-oai-router:cache:helper');

/**
 * Timing start with label. Invoked when DEBUG.
 * @param {string} label
 */
function di(label) {
  if (process.env.DEBUG) {
    perfy.start(label);
  }
}

/**
 * Timing end with label and console the summary. Invoked when DEBUG.
 * @param {string} label
 */
function da(label) {
  if (process.env.DEBUG) {
    const { name, milliseconds } = perfy.end(label);

    console.warn(`di-da:${name}${' '.repeat(20 - name.length)} ${milliseconds}`);
  }
}

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

  di('deserialize');
  const ret = vm.runInThisContext(`(${serialized})`, { timeout: 5000 });
  da('deserialize');

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

  di('serialize');
  const ret = _serialize({ type, primitive, data });
  da('serialize');

  return ret;
}

module.exports = {
  di,
  da,
  readall,
  serialize,
  deserialize,
};
