const fs = require('fs');

async function replyString(ctx, next) {
  ctx.response.body = 'success';
}

async function replyObject(ctx, next) {
  ctx.response.body = { msg: 'success' };
}

async function replyNumber(ctx, next) {
  ctx.response.body = 0;
}

async function replyBuffer(ctx, next) {
  ctx.response.body = Buffer.from('success');
}

async function replyStream(ctx, next) {
  ctx.response.body = fs.createReadStream(__filename);
}

async function reply400(ctx, next) {
  ctx.response.status = 400;
  ctx.response.body = 'success';
}

async function replyNoContentType(ctx, next) {
  ctx.response.type = undefined;
  ctx.response.body = 'success';
}

async function replyThrow(ctx, next) {
  ctx.throw(500, 'ops..');
}

async function replyStreamInvalid(ctx, next) {
  ctx.response.body = fs.createReadStream('abc');
}

module.exports = {
  replyString,
  replyObject,
  replyNumber,
  replyBuffer,
  replyStream,
  reply400,
  replyNoContentType,
  replyThrow,
  replyStreamInvalid,
};
