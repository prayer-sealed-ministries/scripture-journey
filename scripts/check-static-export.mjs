import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'out')
for (const route of ['', 'dashboard', 'map', 'timeline', 'quiz', 'sources', 'prophecies', 'auth/signin', 'auth/verify']) {
  assert.ok(existsSync(path.join(out, route, 'index.html')), `Missing static route ${route}`)
}
assert.ok(!existsSync(path.join(out, 'api')), 'Static artifact must not contain API routes')
assert.ok(existsSync(path.join(out, '404.html')), 'Missing GitHub Pages 404')
assert.ok(existsSync(path.join(out, '.nojekyll')), 'Missing .nojekyll')
assert.equal(readFileSync(path.join(out, 'manifest.json'), 'utf8'), readFileSync(path.join(root, 'public/manifest.json'), 'utf8'), 'PWA identity changed')
for (const name of readdirSync(path.join(root, 'public/icons'))) {
  assert.deepEqual(readFileSync(path.join(out, 'icons', name)), readFileSync(path.join(root, 'public/icons', name)), `PWA icon changed: ${name}`)
}
const lessonFiles = readdirSync(path.join(out, 'lessons')).filter(name => existsSync(path.join(out, 'lessons', name, 'index.html')))
assert.ok(lessonFiles.length > 0, 'No lesson pages exported')
const prerender = JSON.parse(readFileSync(path.join(root, '.static-build/.next/prerender-manifest.json'), 'utf8'))
const routes = Object.keys(prerender.routes).filter(route => route.startsWith('/lessons/'))
assert.equal(lessonFiles.length, routes.length, 'Lesson export count differs from generated routes')
console.log(`Static export checks passed: ${lessonFiles.length} lessons, main routes, no APIs, unchanged PWA identity.`)
