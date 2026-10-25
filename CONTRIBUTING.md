# Development

Requires Node.js 20+ and npm.

```sh
npm install
npm test                  # build, runtime tests, isolated tarball install and type checks
npm run example
npm pack --dry-run        # inspect the package contents
npm pack                  # create skorotkiewicz-handwired-0.1.0.tgz for local installation
```

The build and tests do not depend on `.upstream/` or Bun.
The npm package includes only built JavaScript, TypeScript declarations, the
README and license.
