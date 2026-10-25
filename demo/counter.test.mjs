import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createCounter, maximum} from './counter.mjs'

test('increments, decrements, and resets using the published runtime', () => {
  const counter = createCounter()
  assert.equal(counter.value, 0)
  assert.equal(counter.dispatch('increment'), 1)
  assert.equal(counter.dispatch('increment'), 2)
  assert.equal(counter.dispatch('decrement'), 1)
  assert.equal(counter.dispatch('reset'), 0)
  assert.equal(counter.value, 0)
})

test('clamps at both boundaries', () => {
  const counter = createCounter()
  assert.equal(counter.dispatch('decrement'), 0)
  for (let step = 0; step < maximum + 5; step++) counter.dispatch('increment')
  assert.equal(counter.value, maximum)
  for (let step = 0; step < maximum + 5; step++) counter.dispatch('decrement')
  assert.equal(counter.value, 0)
})

test('clears event cells instead of replaying previous clicks', () => {
  const counter = createCounter()
  counter.dispatch('increment')
  assert.equal(counter.dispatch('decrement'), 0)
  counter.dispatch('reset')
  assert.equal(counter.dispatch('increment'), 1)
})

test('keeps instances independent and rejects unknown actions', () => {
  const first = createCounter()
  const second = createCounter()
  first.dispatch('increment')
  assert.equal(second.value, 0)
  assert.throws(() => first.dispatch('unknown'), /Unknown counter action/)
  assert.equal(first.value, 1)
})
