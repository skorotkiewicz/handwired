import {createEvaluator, createSourceTable, emitCompare, emitSelect, input} from 'handwired'

const table = createSourceTable()
const cells = table.declare({a: input([0, 100], {initial: 5, grid: 1})})
const circuit = table.createCircuit()

// Equivalent to: a > 4 ? 10 : 12
const aboveFour = emitCompare(circuit, cells.a, '>', circuit.constant(4))
const result = emitSelect(circuit, aboveFour, circuit.constant(12), circuit.constant(10))
const program = {...table.finish(), output: {result}}
const evaluate = createEvaluator(program)

console.log(evaluate(program.initialSource).output.result) // 10
