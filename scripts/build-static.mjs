// Export from a disposable staging tree: never remove live server routes or read .env files.
import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stage = path.join(root, '.static-build')
rmSync(stage, { recursive: true, force: true })
mkdirSync(stage)
for (const name of ['app', 'components', 'data', 'hooks', 'lib', 'public', 'types', 'next.config.js', 'next-env.d.ts', 'tsconfig.json', 'tailwind.config.ts', 'postcss.config.js', '.eslintrc.json', 'package.json']) {
  cpSync(path.join(root, name), path.join(stage, name), { recursive: true })
}
for (const name of ['api', 'auth', 'health']) rmSync(path.join(stage, 'app', name), { recursive: true, force: true })
// Keep old bookmarked sign-in URLs useful without retaining a nonfunctional sign-in form.
for (const name of ['signin', 'verify']) {
  const folder = path.join(stage, 'app/auth', name)
  mkdirSync(folder, { recursive: true })
  writeFileSync(path.join(folder, 'page.tsx'), `import Link from 'next/link'; export default function Page(){ return <section><h1 className="text-2xl font-bold">No account needed</h1><p className="mt-4">Scripture Journey now saves progress in this browser only. Previously saved account data is not automatically transferred.</p><Link className="mt-4 inline-block underline" href="/dashboard">Continue to your dashboard</Link></section> }`)
}
symlinkSync(path.join(root, 'node_modules'), path.join(stage, 'node_modules'), 'junction')
const sw = path.join(stage, 'public/sw.js')
// New cache version retires old server-era HTML without changing manifest identity or icons.
writeFileSync(sw, readFileSync(sw, 'utf8').replace('scripture-journey-v2', 'scripture-journey-static-v1').replaceAll('`${BASE}/dashboard`', '`${BASE}/dashboard/`').replaceAll('`${BASE}/prophecies`', '`${BASE}/prophecies/`').replaceAll('`${BASE}/map`', '`${BASE}/map/`').replaceAll('`${BASE}/sources`', '`${BASE}/sources/`'))
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], {
  cwd: stage, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: 'true', NEXT_TELEMETRY_DISABLED: '1' },
})
if (result.status !== 0 || !existsSync(path.join(stage, 'out/index.html'))) process.exit(result.status || 1)
rmSync(path.join(root, 'out'), { recursive: true, force: true })
cpSync(path.join(stage, 'out'), path.join(root, 'out'), { recursive: true })
writeFileSync(path.join(root, 'out/.nojekyll'), '')
console.log('Static root-domain site ready in out/. No server, database, or email credentials used.')
