const crypto = require('crypto');

const { readall } = require('./helper');

function md5(content) {
  const ret = crypto
    .createHmac('md5', 'hello world!')
    .update(content)
    .digest('hex');

  return ret;
}

/**
 * Get response hit key
 * @param {boolean|string} hit
 */
function getHit(hit) {
  let hitKey = null;
  if (hit === true || hit === undefined || hit === null) {
    hitKey = 'X-OAI-HIT';
  } else if (typeof hit === 'string') {
    hitKey = hit;
  }

  return hitKey;
}

/**
 * Get cache key from ctx.
 * @param {object} ctx
 * @returns {string}
 */
async function getKeyBuilder(ctx) {
  const {
    path,
    query,
    params,
  } = ctx;
  const { body } = ctx.request;

  const id = md5([
    JSON.stringify(query),
    JSON.stringify(params),
    JSON.stringify(body),
  ].join());

  const segment = path.replace(/\//g, '___');

  return { id, segment };
}

async function getValueBuilder(ctx) {
  const { type, body } = ctx.response;
  let value = body;

  if (typeof body.pipe === 'function') {
    value = await readall(body);
  }

  return { type, value };
}

module.exports = {
  getHit,
  getKeyBuilder,
  getValueBuilder,
};
