# Handwired

A small, zero-runtime-dependency npm packaging of the core runtime from
[Cheng Lou's Handwired](https://github.com/chenglou/handwired).
Build numeric circuits from weighted sums, products and ReLUs, then evaluate them
with FP32 semantics in JavaScript. Includes cell/state declarations, comparisons,
spring timing helpers and prefix networks.

This is an unofficial runtime-only distribution, not the upstream demo site.
It does not convert arbitrary JavaScript source into a neural network and does
not include the JSON search demo's WebGPU backend.

## Install

```sh
npm install handwired
```

ES modules only; Node.js 20+ or a modern browser bundler. TypeScript declarations
are included. Bun is not required.

## Usage

```js
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
```

Declare ranges and grids before building operations. Inputs must obey those
constraints. For stateful programs, pair every state cell using `table.next`,
then explicitly commit state with `source.set(evaluation.nextValues)`.
Evaluator buffers are reused; copy values you need to keep across calls.

All APIs are available from `handwired`, or through individual entry points:

- `handwired/core` — `Circuit`, numeric builders, evaluators and gradients
- `handwired/cells` — source tables, inputs, events, state and validation
- `handwired/host-timing` — frame scheduling and spring matrices
- `handwired/prefix-networks` — parallel prefix algorithms

See the upstream [tutorial](https://github.com/chenglou/handwired/blob/257856e3b221140acb4cc4460626b850c0bd4ff1/docs/tutorial.md)
and [execution model](https://github.com/chenglou/handwired/blob/257856e3b221140acb4cc4460626b850c0bd4ff1/docs/execution-model.md)
for API details. Replace their relative runtime imports with the package entry
points above.

## Development

```sh
npm install
npm test                  # build, runtime tests, isolated tarball install and type checks
npm run example
npm pack --dry-run        # inspect the package contents
npm pack                  # create a local .tgz
```

Only built JavaScript, declarations, the README and license are published.
The build and tests do not depend on `.upstream/`.

## Publishing

This repository is prepared for publishing, but has not been published by this setup.
Before publishing, choose an available npm name (or your own `@scope/handwired`)
in `package.json`. If you rename it, update the imports in the README, examples
and tests too. After logging in to npm, run:

```sh
npm test
npm publish --access public
```

## Attribution

Runtime sources are copied without changes from
[chenglou/handwired](https://github.com/chenglou/handwired), revision
`257856e3b221140acb4cc4460626b850c0bd4ff1`.
Copyright (c) 2026 Cheng Lou. Distributed under the [MIT license](LICENSE).
