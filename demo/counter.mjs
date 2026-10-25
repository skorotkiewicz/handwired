import {createEvaluator, createSourceTable, emitClampExact, emitSelect, event, state} from '@skorotkiewicz/handwired'

export const maximum = 20

export function createCounter() {
  const table = createSourceTable()
  const cells = table.declare({
    count: state([0, maximum], {grid: 1}),
    increment: event(),
    decrement: event(),
    reset: event(),
  })
  const circuit = table.createCircuit()
  const changed = circuit.affine([[cells.count, 1], [cells.increment, 1], [cells.decrement, -1]])
  const clamped = emitClampExact(circuit, changed, circuit.constant(0), circuit.constant(maximum))
  const count = emitSelect(circuit, cells.reset, clamped, circuit.constant(0))
  table.next(cells.count, count)

  const program = {...table.finish(), output: {count}}
  const evaluate = createEvaluator(program)
  const source = new Float32Array(program.initialSource)
  const events = {increment: cells.increment, decrement: cells.decrement, reset: cells.reset}

  return {
    get value() {
      return source[cells.count]
    },
    dispatch(action) {
      if (!Object.hasOwn(events, action)) throw new Error(`Unknown counter action: ${action}`)
      source[events[action]] = 1
      const result = evaluate(source)
      source.set(result.nextValues)
      return result.output.count
    },
  }
}
