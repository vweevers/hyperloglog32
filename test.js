var HyperLogLog = require('./index')
  , test = require('tape');

test('empty hll has cardinality of zero', function(t) {
  t.equals(HyperLogLog(8).count(), 0)
  t.end()
})

test('counts unique values', function (t) {
  var h = HyperLogLog(6).add('value 1')

  t.equals(h.count(), 1)

  for (var i = 0; i < 100; ++i) {
    h.add('value 1')
    h.add('value 2')
    h.add('value 3')
  }

  t.equals(h.count(), 3)

  h = HyperLogLog(6)
  for (var i = 0; i < 100; i++) h.add(i % 3)
  t.equals(h.count(), 3)

  h = HyperLogLog(6)
  for (var i = 0; i < 100; i++) h.add(i % 5)
  t.equals(h.count(), 5)

  t.end()
})

test('merges overlapping counts', function (t) {
  t.test('using instance merge', merge.bind(null, false))
  t.test('using buffer merge', merge.bind(null, true))

  function merge(asBuffer, t) {
    var h = HyperLogLog(15)
    var h2 = HyperLogLog(15)

    for (var i = 0; i < 100; ++i) {
      h.add('Just h ' + i)
      h2.add('Just h2 ' + i)

      h.add('Both ' + i)
      h2.add('Both ' + i)
    }

    t.ok(Math.abs(h.count() - 200) <= 2)
    t.ok(Math.abs(h2.count() - 200) <= 2)

    h.merge(asBuffer ? h2.state() : h2)

    t.equal(h.state().length, Math.pow(2, 15), 'length ok')
    t.ok(Math.abs(h.count() - 300) <= 3)
    t.end()
  }
})

test('merges bigger HLL into a smaller one', function(t) {
  var hll = HyperLogLog(8)
  var hll2 = HyperLogLog(14)

  var original_error = hll.error();

  hll.add('Just hll')
  hll2.add('Just hll2')

  hll.add('both')
  hll2.add('both')

  hll.merge(hll2.state())

  t.equals(hll.count(), 3);
  t.ok(hll.error() == original_error)
  t.end()
})

test('merges a smaller HLL into a bigger one', function(t) {
  // The result is the same size as the smaller one.
  var hll = HyperLogLog(14)
  var hll2 = HyperLogLog(8)

  var original_error = hll.error()

  hll.add('Just hll')
  hll2.add('Just hll2')

  hll.add('both')
  hll2.add('both')

  hll.merge(hll2.state())

  t.equals(hll.count(), 3)
  t.ok(hll.error() > original_error)
  t.end()
})
