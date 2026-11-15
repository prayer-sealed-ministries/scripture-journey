import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('static edition local progress', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_STATIC_EXPORT', 'true')
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules() })
  it('retains completion, scores, sessions and streak across module reload without network requests', async () => {
    let progress = await import('@/lib/progress')
    progress.markLessonComplete('test-lesson')
    progress.markLessonComplete('test-lesson')
    progress.saveQuizScore('test-lesson', { multipleChoice: true })
    progress.incrementQuizSessions()
    await progress.syncOnLogin()
    vi.resetModules()
    progress = await import('@/lib/progress')
    expect(progress.getCompletedLessons()).toEqual(['test-lesson'])
    expect(progress.getQuizStats()).toEqual({total: 1, perfect: 1, attempted: 1, sessions: 1})
    expect(progress.getStreak()).toEqual({current: 1, best: 1})
    expect(fetch).not.toHaveBeenCalled()
  })
})
