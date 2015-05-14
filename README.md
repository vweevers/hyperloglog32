# hyperloglog32

> HyperLogLog distinct value estimator for node and the browser using a 32-bit murmurhash3. Fork of [hyperloglog](https://www.npmjs.com/package/hyperloglog) (MIT © Optimizely, Inc). From [Wikipedia](https://en.wikipedia.org/wiki/HyperLogLog): HyperLogLog is an algorithm for the count-distinct problem, approximating the number of distinct elements in a multiset (the cardinality).

[![npm status](http://img.shields.io/npm/v/hyperloglog32.svg?style=flat-square)](https://www.npmjs.org/package/hyperloglog32) [![Travis build status](https://img.shields.io/travis/vweevers/hyperloglog32.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/hyperloglog32) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/hyperloglog32.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/hyperloglog32) [![Dependency status](https://img.shields.io/david/vweevers/hyperloglog32.svg?style=flat-square)](https://david-dm.org/vweevers/hyperloglog32)

Jump to: [api](#api) / [install](#install) / [license](#license)

## example

Insert two distinct values into an HLL structure with 12 bit indices. Hashing is done for you:

```js
var HyperLogLog = require('hyperloglog32')
var h = HyperLogLog(12)

h.add('value 1')
h.add('value 2')
h.add('value 1')

h.count() === 2;
```

## api

### `h = HyperLogLog(n)`

Construct an HLL data structure with `n` bit indices. This implies that there will be `2^n` buckets (and required octets). Typical values for `n` are around 12, which would use 4096 buckets and yield less than 1.625% relative error. Higher values use more memory but provide greater precision. [Here](https://www.npmjs.com/package/hll)'s a nice table.

### `h.add(string)`

Add a value.

### `h.count()`

Get the current estimate of the number of distinct values.

### `h.state()`

Get the internal HLL state as a `Buffer`.

### `h.merge(h2 || Buffer)`

Merge another HLL's state into this HLL. If the incoming data has fewer buckets than this HLL, this one will be folded down to be the same size as the incoming data, with a corresponding loss of precision. If the incoming data has more buckets, it will be folded down as it is merged. The result is that this HLL will be updated as though it had processed all values that were previously processed by either HLL.

```js
h1.add('value 1')
h1.add('value 2')
h2.add('value 2')
h2.add('value 3')

h1.merge(h2)
h1.count() === 3;
```

### `h.error()`

Estimate the relative error for this HLL.

## install

With [npm](https://npmjs.org) do:

```
npm i hyperloglog32
```

and [browserify](http://browserify.org/) for the browser.

## license

[MIT](http://opensource.org/licenses/MIT) © [Vincent Weevers](http://vincentweevers.nl)
