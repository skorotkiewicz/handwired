# Private counter demo

A tiny browser app using the published `@skorotkiewicz/handwired@0.1.1` package,
not the library sources in this repository. The app is marked `private` and is
not included in the library's npm package.

From this directory:

```sh
npm install
npm start
```

Open the local URL printed by Vite. Requires Node.js 20.19+ or 22.12+.

```sh
npm test          # exercise the circuit against the published dependency
npm run build     # create a static browser build in dist/
npm run preview   # serve the static build locally
```

The buttons set event cells. Handwired computes the next counter value, clamps
it to 0–20 and resets the event cells. The host commits the next state and
updates the DOM. See `counter.mjs` for the circuit and `main.mjs` for the UI.
