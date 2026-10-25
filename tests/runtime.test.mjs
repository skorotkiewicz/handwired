import assert from 'node:assert/strict'
import {test} from 'node:test'
import {Circuit, createEvaluator, createSourceTable, emitCompare, emitSelect, event, input, stateBit} from '@skorotkiewicz/handwired'
import {Circuit as CoreCircuit} from '@skorotkiewicz/handwired/core'
import {createSourceTable as createTable} from '@skorotkiewicz/handwired/cells'
import {identitySpringMatrix, springMatrixPower} from '@skorotkiewicz/handwired/host-timing'
import {brentKungPrefix, sklanskyPrefix} from '@skorotkiewicz/handwired/prefix-networks'

test('root and subpath exports share the same implementation', () => {
  assert.equal(Circuit, CoreCircuit)
  assert.equal(createSourceTable, createTable)
  assert.deepEqual(springMatrixPower([1, 0, 0, 1], 3), identitySpringMatrix)
  for (const prefix of [brentKungPrefix, sklanskyPrefix]) {
    assert.deepEqual(prefix([1, 2, 3, 4], (a, b) => a + b), [1, 3, 6, 10])
  }
})

test('comparison matches the documented conditional and validates inputs', () => {
  const table = createSourceTable()
  const cells = table.declare({a: input([0, 100], {grid: 1})})
  const circuit = table.createCircuit()
  const gate = emitCompare(circuit, cells.a, '>', circuit.constant(4))
  const result = emitSelect(circuit, gate, circuit.constant(12), circuit.constant(10))
  const program = {...table.finish(), output: {result}}
  const evaluate = createEvaluator(program)
  const source = new Float32Array(program.initialSource)

  for (const a of [0, 4, 5, 100]) {
    source[cells.a] = a
    assert.equal(evaluate(source).output.result, a > 4 ? 10 : 12)
  }
  source[cells.a] = 101
  assert.throws(() => evaluate(source), /within 0\.\.100/)
  source[cells.a] = 4.5
  assert.throws(() => evaluate(source), /multiple of 1/)
})

test('state is committed explicitly and events reset after evaluation', () => {
  const table = createSourceTable()
  const cells = table.declare({click: event(), on: stateBit()})
  const circuit = table.createCircuit()
  const on = emitSelect(circuit, cells.click, cells.on, circuit.affine([[cells.on, -1]], 1))
  table.next(cells.on, on)
  const program = {...table.finish(), output: {on}}
  const evaluate = createEvaluator(program)
  const source = new Float32Array(program.initialSource)

  source[cells.click] = 1
  const first = evaluate(source)
  assert.equal(first.output.on, 1)
  assert.equal(first.nextValues[cells.click], 0)
  assert.equal(source[cells.on], 0)
  source.set(first.nextValues)
  assert.equal(evaluate(source).output.on, 1)
  source[cells.click] = 1
  assert.equal(evaluate(source).output.on, 0)
})
