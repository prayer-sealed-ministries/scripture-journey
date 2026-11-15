# Static edition and GitHub Pages cutover

`npm ci && npm run build:static` produces `out/` with all lessons, map, timeline,
search, quiz, dashboard and browser-local progress. The regular `npm run build`
remains a server build. `scripts/build-static.mjs` makes an ignored staging tree,
excludes server routes and environment files, disables session/sync/error-report
requests, and aliases the session provider to a no-network implementation.

This export targets the root of **scripture.prayersealed.org**, not a repository
subpath. Do not publish at `/scripture-journey/` without adapting and testing all
asset, link, service-worker and manifest paths. Preview on a root localhost origin.

## Before switching the live domain

1. Build and test `out/` with a static server. Refresh lesson/dashboard URLs directly;
   test completion, quiz, filtering, theme, mobile menu and installed PWA updates.
2. Back up the current PostgreSQL database and separately confirm recovery. Do not
   delete Render or its database. Server-only account progress does not automatically
   transfer to the browser. Before cutover, existing readers can sign in to the old
   app on the browser they intend to keep and confirm synced progress is visible;
   the current login sync merges completion, scores and streak. Still verify each
   metric and keep a database backup; this is not a complete account-data export.
   Coordinate an export/transition if users need that data.
3. Existing localStorage keys and PWA manifest/icons are unchanged. Keeping the exact
   HTTPS origin preserves browser progress; changing the hostname does not. Clearing
   browser data/private browsing can erase progress. No account or cross-device sync.
4. Only after authorization: enable Pages using GitHub Actions and deploy the `out/`
   artifact with official upload-pages-artifact/deploy-pages actions; configure and
   verify the custom domain, then switch DNS and verify HTTPS/live routes. Ensure the
   Pages custom domain is set before exposing its DNS; don't leave dangling records.
5. Confirm browser storage and a previously installed PWA work after update. The
   export uses a new SW cache name to retire old HTML. Offline mode is best-effort
   for previously visited pages, not a promise that all lessons are predownloaded.
6. Keep Render available for rollback until tests and any account-data handoff are
   verified. Ending paid hosting or deleting data is a separate authorized action.

The existing CI workflow only validates; the static build addition does **not**
enable Pages, change DNS, deploy, or change the live Render database.
