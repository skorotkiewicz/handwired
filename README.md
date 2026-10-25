# Handwired

Build and evaluate differentiable numeric circuits in JavaScript, with no runtime
dependencies. Construct circuits from weighted sums, products and ReLUs, and run
them with FP32 semantics. Includes cell/state declarations, comparisons, spring
timing helpers and prefix networks.

This is an unofficial runtime-only distribution, not the upstream demo site.
It does not convert arbitrary JavaScript source into a neural network and does
not include the JSON search demo's WebGPU backend.

## Install

Install the package tarball:

```sh
npm install ./skorotkiewicz-handwired-0.1.0.tgz
```

ES modules only; Node.js 20+ or a modern browser bundler. TypeScript declarations
are included. Bun is not required.

## Usage

```js
import {createEvaluator, createSourceTable, emitCompare, emitSelect, input} from '@skorotkiewicz/handwired'

const table = createSourceTable()
const cells = table.declare({a: input([0, 100], {initial: 5, grid: 1})})
const circuit = table.createCircuit()

// Equivalent to: a > 4 ? 10 : 12
const aboveFour = emitCompare(circuit, cells.a, '>', circuit.constant(4))
const result = emitSelect(circuit, aboveFour, circuit.constant(12), circuit.constant(10))
const program = {...table.finish(), output: {result}}
const evaluate = createEvaluator(program)

console.log(evaluate(program.initialSource).output.result) // 10
```

Declare ranges and grids before building operations. Inputs must obey those
constraints. For stateful programs, pair every state cell using `table.next`,
then explicitly commit state with `source.set(evaluation.nextValues)`.
Evaluator buffers are reused; copy values you need to keep across calls.

All APIs are available from `@skorotkiewicz/handwired`, or through individual entry points:

- `@skorotkiewicz/handwired/core` — `Circuit`, numeric builders, evaluators and gradients
- `@skorotkiewicz/handwired/cells` — source tables, inputs, events, state and validation
- `@skorotkiewicz/handwired/host-timing` — frame scheduling and spring matrices
- `@skorotkiewicz/handwired/prefix-networks` — parallel prefix algorithms

See the upstream [tutorial](https://github.com/chenglou/handwired/blob/257856e3b221140acb4cc4460626b850c0bd4ff1/docs/tutorial.md)
and [execution model](https://github.com/chenglou/handwired/blob/257856e3b221140acb4cc4460626b850c0bd4ff1/docs/execution-model.md)
for API details. Replace their relative runtime imports with the package entry
points above.

## Attribution

Runtime sources are copied without changes from
[chenglou/handwired](https://github.com/chenglou/handwired), revision
`257856e3b221140acb4cc4460626b850c0bd4ff1`.
Copyright (c) 2026 Cheng Lou. Distributed under the [MIT license](LICENSE).
