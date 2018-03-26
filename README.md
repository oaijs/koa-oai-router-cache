# Koa-OAI-Router-Cache

[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT

[node-image]: https://img.shields.io/badge/node.js-v7.6.0-blue.svg
[node-url]: http://nodejs.org/download/

[npm-img]: https://img.shields.io/npm/v/koa-oai-router-cache.svg
[npm-url]: https://npmjs.org/package/koa-oai-router-cache

[travis-img]: https://travis-ci.org/oaijs/koa-oai-router-cache.svg
[travis-url]: https://travis-ci.org/oaijs/koa-oai-router-cache

[coveralls-img]: https://coveralls.io/repos/github/oaijs/koa-oai-router-cache/badge.svg
[coveralls-url]: https://coveralls.io/github/oaijs/koa-oai-router-cache

[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router-cache.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router-cache

[david-img]: https://img.shields.io/david/oaijs/koa-oai-router-cache.svg
[david-url]: https://david-dm.org/oaijs/koa-oai-router-cache

[router]: https://github.com/BiteBit/koa-oai-router

[catbox]: https://github.com/hapijs/catbox

[![License][license-img]][license-url]
[![Node Version][node-image]][node-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

Request form cache plugin for [koa-oai-router][router].

# Installation
Multi-strategy object caching service depends on [catbox][catbox].

```bash
npm i koa-oai-router-cache catbox-redis --save
```

# Info
|field|type|info|
|---|---|---|
|name|`string`|`cache`|
|evoked fields|`string`| `x-oai-cache`|
|evoked value|`object`| `enable`, `expire` |
|options|`object`| `hit`, `key`, `value` |

* `evoked value` `object`
  * `enable` `boolean` enable cache, default `true`
  * `expire` `string|number` ttl
    ```
    1. ms, milli, millisecond, milliseconds - will parse to milliseconds
    2. s, sec, secs, second, seconds - will parse to seconds
    3. m, min, mins, minute, minutes - will parse to minutes
    4. h, hr, hrs, hour, hours - will parse to hours
    5. d, day, days - will parse to days
    6. w, week, weeks - will parse to weeks
    7. mon, mth, mths, month, months - will parse to months
    8. y, yr, yrs, year, years - will parse to years
    ```

* `options` `object`
  * `hit` `object | boolean` `false` not response header. `true` responses header `x-oai-hit`: true. `string` response header with custom key.
  * `key` `function` cache key builder. having args (ctx) and must return {id, segment}
  * `keyInParameters` `boolean` only build cache key in parameters, default `true`
  * `value` `function` cache value builder. having args (ctx) and must return {type, value}

# Usage
Simple code:
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middlewareLoader = require('koa-oai-router-middleware');
const cacheHandler = require('koa-oai-router-cache');
const catboxRedis = require('catbox-redis');

const app = new Koa();
const router = new Router({
  apiDoc: './api',
});

router.moount();

router.mount(middlewareLoader('./controllers'));
router.mount(cacheHandler({engine: catboxRedis, options: {url: 'redis://127.0.0.1:6379'}}));

app.use(bodyParser());
app.use(router.routes());
```

```yaml
/pets-string:
  get:
    description: "Returns all pets from the system that the user has access to"
    operationId: "findPets"
    produces:
      - "application/json"
    tags:
      - pets
    parameters:
      - name: "name"
        in: "query"
        required: true
        type: "string"
    # configure api cache here
    x-oai-cache:
      expire: 10s
    x-oai-middleware:
      - file: pets
        handler: replyString
    responses:
      "200":
        description: "pet response"
        schema:
          type: "array"
          items:
            $ref: "#/definitions/Pet"
      default:
        description: "unexpected error"
```
