import {Circuit, createEvaluator, createSourceTable, input, type Wire} from 'handwired'
import {Circuit as CoreCircuit} from 'handwired/core'
import {stateBit} from 'handwired/cells'
import {springMatrixPower} from 'handwired/host-timing'
import {sklanskyPrefix} from 'handwired/prefix-networks'

const table = createSourceTable()
const cells = table.declare({value: input([0, 10])})
const circuit: Circuit = table.createCircuit()
const output: Wire = circuit.affine([[cells.value, 2]])
const program = {...table.finish(), output: {doubled: output}}
const result: number = createEvaluator(program)(program.initialSource).output.doubled

// @ts-expect-error Wires must come from the circuit, not plain numbers.
const invalid: Wire = 1

void [CoreCircuit, stateBit(), springMatrixPower([1, 0, 0, 1], 2), sklanskyPrefix([result], (a, b) => a + b), invalid]
