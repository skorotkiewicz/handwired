import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {copyFileSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {test} from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

test('tarball installs independently and exposes working JavaScript and types', () => {
  const directory = mkdtempSync(join(tmpdir(), 'handwired-package-'))
  const run = (command, args, cwd = directory) => execFileSync(command, args, {cwd, encoding: 'utf8', stdio: 'pipe'})
  try {
    const [packed] = JSON.parse(run(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', directory], root))
    assert.equal(packed.name, '@skorotkiewicz/handwired')
    assert.equal(packed.filename, 'skorotkiewicz-handwired-0.1.0.tgz')
    const files = packed.files.map(file => file.path)
    assert.ok(files.includes('LICENSE'))
    assert.ok(files.includes('README.md'))
    assert.ok(files.includes('dist/index.js'))
    assert.ok(files.includes('dist/index.d.ts'))
    assert.ok(files.every(file => file.startsWith('dist/') || ['LICENSE', 'README.md', 'package.json'].includes(file)))

    writeFileSync(join(directory, 'package.json'), JSON.stringify({private: true, type: 'module'}))
    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', join(directory, packed.filename)])
    copyFileSync(join(root, 'examples/compare.mjs'), join(directory, 'compare.mjs'))
    assert.equal(run(process.execPath, ['compare.mjs']).trim(), '10')
    copyFileSync(join(root, 'tests/consumer.ts'), join(directory, 'consumer.ts'))
    run(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--target', 'ES2022', '--module', 'NodeNext', 'consumer.ts'])
  } finally {
    rmSync(directory, {recursive: true, force: true})
  }
})
