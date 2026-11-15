// Real-browser regression suite for the built out/ artifact, never the live site.
// Run after build:static with a root-domain static server on loopback.
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const base = new URL(process.argv[2] || 'http://127.0.0.1:4173/')
assert.equal(base.protocol, 'http:')
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Only loopback previews are permitted')
assert.equal(base.pathname, '/', 'This export requires a root-domain preview')
assert.equal(base.search + base.hash + base.username + base.password, '')
const url = (route = '') => new URL(route, base).href
const deadline = setTimeout(() => { console.error('Browser smoke exceeded four minutes'); process.exit(1) }, 240_000)
await mkdir('test-results', { recursive: true })
const browser = await chromium.launch().catch(error => { clearTimeout(deadline); throw error })

async function scenario(name, options, exercise) {
  const context = await browser.newContext(options)
  context.setDefaultTimeout(15_000)
  context.setDefaultNavigationTimeout(30_000)
  const violations = [], errors = [], badResponses = []
  await context.route('**/*', async route => {
    const requestURL = new URL(route.request().url())
    if (requestURL.origin !== base.origin) {
      violations.push(`external: ${requestURL.href}`)
      return route.abort('blockedbyclient')
    }
    if (requestURL.pathname.startsWith('/api/')) {
      violations.push(`backend: ${requestURL.href}`)
      return route.abort('blockedbyclient')
    }
    return route.continue()
  })
  context.on('request', request => {
    if (new URL(request.url()).pathname.startsWith('/api/')) violations.push(request.url())
  })
  context.on('response', response => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`)
  })
  await context.tracing.start({ screenshots: true, snapshots: true })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  try {
    await exercise(page, context)
    assert.deepEqual(violations, [], 'Unexpected nonlocal or backend requests')
    assert.deepEqual(errors, [], 'Unexpected browser errors')
    assert.deepEqual(badResponses, [], 'Unexpected failed HTTP responses')
    console.log(`PASS: ${name}`)
  } catch (error) {
    await page.screenshot({ path: `test-results/${name}-failure.png`, fullPage: true }).catch(() => {})
    throw error
  } finally {
    await context.tracing.stop({ path: `test-results/${name}-trace.zip` })
    await context.close()
  }
}

try {
  // Keep the online functional pass independent from service-worker caching.
  await scenario('online-progress-quiz', { viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }, async page => {
    assert.equal((await page.goto(url())).status(), 200)
    await page.getByRole('heading', { name: 'Explore How Scripture Points to Jesus', exact: true }).waitFor()
    const firstLesson = page.locator('main').getByRole('link').filter({ hasText: 'Lesson 1: The First Promise' })
    const lessonURL = new URL(await firstLesson.getAttribute('href'), base)
    assert.equal(lessonURL.origin, base.origin)
    assert.ok(lessonURL.pathname.startsWith('/lessons/'))
    await firstLesson.click()
    await page.waitForURL(current => current.pathname.replace(/\/$/, '') === lessonURL.pathname.replace(/\/$/, ''))
    const canonicalLessonURL = page.url()
    const slug = new URL(canonicalLessonURL).pathname.split('/').filter(Boolean).at(-1)
    assert.equal((await page.goto(canonicalLessonURL)).status(), 200)
    await page.getByRole('button', { name: 'Mark this lesson as complete', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Lesson Completed' }).waitFor()
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('scripture_journey_progress'))), [slug])
    await page.reload()
    await page.getByRole('status').filter({ hasText: 'Lesson Completed' }).waitFor()
    assert.equal((await page.goto(url('dashboard/'))).status(), 200)
    await page.getByText(/^1 \/ \d+ Lessons$/).waitFor()
    await page.getByText(/Progress is saved only in this browser/).waitFor()
    assert.equal(await page.getByRole('link', { name: 'Sign in', exact: true }).count(), 0)
    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Close menu', exact: true }).click()
    assert.equal(await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).count(), 0)

    // Pointer dismissal must not break native keyboard activation.
    await page.getByRole('button', { name: 'Open menu', exact: true }).press('Enter')
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Close menu', exact: true }).press('Space')
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).waitFor({ state: 'detached' })
    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).waitFor()
    await page.getByText(/Progress is saved only in this browser/).click()
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).waitFor({ state: 'detached' })

    for (const route of ['prophecies/', 'map/', 'timeline/', 'sources/']) {
      assert.equal((await page.goto(url(route))).status(), 200, route)
      await page.locator('main').waitFor()
      assert.ok((await page.locator('main').innerText()).trim(), route)
    }

    await page.goto(url('quiz/'))
    await page.getByRole('button', { name: 'Start Quiz →', exact: true }).click()
    let correct = 0
    for (let i = 0; i < 10; i++) {
      await page.getByText(`Question ${i + 1} of 10`, { exact: true }).waitFor()
      const submit = page.getByRole('button', { name: 'Submit Answer', exact: true })
      assert.ok(await submit.isDisabled(), 'An unselected question cannot be submitted')
      // Exercise a genuine UI answer, not injected application scores.
      await page.locator('main button').first().click()
      await submit.click()
      await page.getByText(/^(✓ Correct!|✗ The answer was)/).waitFor()
      if (await page.getByText(/^✓ Correct!/).count()) correct++
      await page.getByRole('button', { name: i === 9 ? 'See Results →' : 'Next Question →', exact: true }).click()
    }
    await page.getByText(`You scored ${correct} / 10`, { exact: true }).waitFor()
    const readStored = () => page.evaluate(() => ({
      scores: JSON.parse(localStorage.getItem('scripture_journey_quiz_scores')),
      sessions: localStorage.getItem('scripture_journey_quiz_sessions'),
      streak: JSON.parse(localStorage.getItem('scripture_journey_streak')),
    }))
    const snapshot = await readStored()
    assert.equal(Object.keys(snapshot.scores).length, 10)
    assert.equal(snapshot.sessions, '1')
    assert.equal(Object.values(snapshot.scores).filter(score => score.multipleChoice).length, correct)
    assert.ok(snapshot.streak && typeof snapshot.streak.current === 'number')
    await page.getByRole('button', { name: 'Retake Quiz', exact: true }).click()
    assert.deepEqual(await readStored(), snapshot, 'Retake must not double-count a session')
    await page.reload()
    await page.getByRole('button', { name: 'Start Quiz →', exact: true }).waitFor()
    assert.deepEqual(await readStored(), snapshot, 'Saved quiz and streak must survive reload')
    await page.goto(url('dashboard/'))
    await page.getByText(`Accuracy (${correct} / 10 questions)`, { exact: true }).waitFor()
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('scripture_journey_progress'))), [slug])
  })

  // Fresh, independent context exercises the production registration and cache code.
  await scenario('offline-visited-lesson', { serviceWorkers: 'allow' }, async (page, context) => {
    await page.goto(url())
    await page.evaluate(() => navigator.serviceWorker.ready)
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
    // Registration may reload once on controllerchange; allow that load to settle.
    await page.waitForLoadState('networkidle')
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller.scriptURL), url('sw.js'))
    const names = await page.evaluate(() => caches.keys())
    assert.ok(names.includes('scripture-journey-static-v1'))
    const lesson = url('lessons/seed-of-the-woman/')
    await page.goto(lesson)
    await page.getByRole('button', { name: 'Mark this lesson as complete', exact: true }).waitFor()
    const heading = await page.locator('main h1').innerText()
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(async target => {
      const response = await caches.match(target)
      return Boolean(response?.ok && response.headers.get('content-type')?.includes('text/html'))
    }, lesson)
    await context.setOffline(true)
    assert.equal((await page.goto(lesson)).status(), 200)
    await page.getByRole('button', { name: 'Mark this lesson as complete', exact: true }).waitFor()
    assert.equal(await page.locator('main h1').innerText(), heading)
    await page.getByRole('button', { name: 'Mark this lesson as complete', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Lesson Completed' }).waitFor()
    await page.reload()
    await page.getByRole('status').filter({ hasText: 'Lesson Completed' }).waitFor()
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('scripture_journey_progress'))), ['seed-of-the-woman'])
  })
} finally {
  clearTimeout(deadline)
  await browser.close()
}
