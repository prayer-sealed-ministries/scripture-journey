# Scripture Journey

<p align="center">
  <img src="docs/banner.png" alt="Scripture Journey" width="500" height="263"/>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 14"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-CC--BY--NC--SA--4.0-22c55e?style=flat-square" alt="CC BY-NC-SA 4.0 License"></a>
  <img src="https://img.shields.io/badge/PWA-Installable-f97316?style=flat-square&logo=pwa&logoColor=white" alt="PWA Installable">
</p>

<p align="center"><em>A Christ-centered learning app for exploring how the whole Bible points to Jesus.</em></p>

## Explore How the Bible Points to Jesus

> *"And beginning with Moses and all the Prophets, he explained to them what was said in all the Scriptures concerning himself."*
> — **Luke 24:27 (NIV)**

Scripture Journey is a Christ-centered web app that helps readers explore how the entire Bible points to Jesus through **200 messianic prophecy lessons**.

Each lesson connects:

- Old Testament prophecy
- New Testament fulfillment
- Scholarly attribution
- A reflective *"Why This Matters"* section

---

## Quick Links

<p align="center">
  🌐 <a href="https://scripture.prayersealed.org/">Live Demo</a> &nbsp;|&nbsp;
  📚 <a href="https://scripture.prayersealed.org/prophecies">Browse Lessons</a> &nbsp;|&nbsp;
  🗺️ <a href="https://scripture.prayersealed.org/map">Prophecy Map</a> &nbsp;|&nbsp;
  ⏳ <a href="https://scripture.prayersealed.org/timeline">Timeline</a> &nbsp;|&nbsp;
  🧠 <a href="https://scripture.prayersealed.org/quiz">Quiz</a>
</p>

---

## Part of a larger path

Scripture Journey is **Step 2 — Understand** in the Scripture & ministry path of [Prayer Sealed Ministries, Inc.](https://prayersealed.org), built by [Paul Clark](https://github.com/systemslibrarian). It is where seeing Jesus at the center of all Scripture begins. If you're new to faith, the path begins with **[Gospel Journey](https://gospel.prayersealed.org/)** — coming to know Jesus Christ as Lord and Savior.

| # | Stage | Project |
|---|---|---|
| 1 | Believe | [Gospel Journey](https://gospel.prayersealed.org/) · [repo](https://github.com/systemslibrarian/gospel-journey) |
| **2** | **Understand** | **Scripture Journey** ← you are here |
| 3 | Remember | [Hide in Heart](https://heart.prayersealed.org/) · [repo](https://github.com/systemslibrarian/HideInHeart) |
| 4 | Discern | [His Will Guide](https://guide.prayersealed.org/) · [repo](https://github.com/systemslibrarian/hiswillguide) |
| 5 | Intercede | [Prayer Sealed](https://app.prayersealed.org/) |
| 6 | Pass It On | My Life With Christ *(in development)* |

---

## Why Scripture Journey Exists

Many Bible tools help people read Scripture, but fewer help them trace how the entire biblical story points to Christ.

Scripture Journey was built to guide learners through a simple progression:

**Lesson → Category → Biblical Storyline → Christ**

Inspired by Luke 24:27, the app helps users explore the unfolding promise of the Messiah in a way that is reverent, approachable, and visually clear.

---

## Screenshots

| Homepage | Prophecy Map |
|:---:|:---:|
| ![Homepage](docs/screenshots/home.png) | ![Prophecy Map](docs/screenshots/map.png) |

| Timeline | Lesson Page |
|:---:|:---:|
| ![Timeline](docs/screenshots/timeline.png) | ![Lesson Page](docs/screenshots/lesson.png) |

| Dashboard | Quiz |
|:---:|:---:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Quiz](docs/screenshots/quiz.png) |

---

## Features

- **200 prophecy-centered lessons**, each including:
  - Old Testament prophecy + New Testament fulfillment
  - A unique *"Why This Matters"* reflection
  - Scholarly source badges
- **7 prophetic categories**: Lineage, Identity, Ministry, Rejection, Passion, Resurrection, Kingdom
- **5 prophecy types**: Direct Prophecy, Messianic Psalm, Typology, Prophetic Pattern, Applied Psalm
- Visual **Prophecy Map** and **Timeline**
- **Dashboard** with progress tracking and study streak
- **Adaptive quiz** drawn from completed lessons
- **Search and filtering** across all lessons
- **Surprise Me** random lesson feature
- **Sources page** with per-scholar lesson counts
- Local progress tracking via `localStorage`
- **PWA** install support
- Accessible, responsive UI

---

## Prophetic Categories

| Category | Description |
|---|---|
| **Lineage** | Ancestry and genealogy of the Messiah |
| **Identity** | Names, titles, and nature of the Messiah |
| **Ministry** | Teaching, miracles, and mission |
| **Rejection** | Opposition, betrayal, and denial |
| **Passion** | Suffering and crucifixion |
| **Resurrection** | Rising from the dead |
| **Kingdom** | Messiah's reign and eternal dominion |

---

## Example Lesson

| Field | Content |
|---|---|
| **Title** | Seed of the Woman |
| **Old Testament** | Genesis 3:15 |
| **New Testament** | 1 John 3:8 |
| **Theme** | The promised descendant who would defeat the serpent |
| **Category** | Lineage |
| **Type** | Direct Prophecy |

> *"Why This Matters"* — This is the first messianic promise in Scripture, sometimes called the *Protoevangelium* ("first gospel"). From the very moment of humanity's fall, God pointed toward a Redeemer.

---

## Scholarly Sources

Lessons are attributed to three widely recognized works on messianic prophecy:

### 📘 J. Barton Payne — *Encyclopedia of Biblical Prophecy* (1973)
Catalogs 191 messianic prophecies and provides the numbering system used for cross-reference. Referenced in **66 lessons**.

### 📚 Alfred Edersheim — *The Life and Times of Jesus the Messiah* (1883)
Appendix IX catalogs 456 Old Testament passages applied to the Messiah. Referenced in **155 lessons**.

### 📖 Josh McDowell — *The New Evidence That Demands a Verdict* (1999)
Provides detailed evidence for prophecy fulfillment. Referenced in **59 lessons**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL |
| Hosting | Render |
| App Format | Progressive Web App |

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
# Build for production
npm run build
npm start
```

### Project Structure

```
app/         Next.js App Router pages
components/  Reusable UI components
data/        Lesson dataset
lib/         Utilities and types
public/      Static assets and PWA files
```

---

## Deployment

Configured for [Render](https://render.com) with a managed PostgreSQL database.

**Required environment variables:**

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
EMAIL_FROM=
```

Database migrations run automatically on deploy:

```bash
prisma migrate deploy
```

---

## Scripture Attribution

Scripture quotations taken from *The Holy Bible, New International Version® NIV®*.  
Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc. Used for educational and devotional purposes.

---

## Mission

Scripture Journey exists to help people explore Scripture thoughtfully and reverently — and to see how the entire biblical story points to Jesus.

## Ministry Domain Setup

The intended production address is `https://scripture.prayersealed.org`.
The app is configured for Render; a GitHub Pages `CNAME` file is not used.

1. In the existing Render web service, open Settings → Custom Domains and add `scripture.prayersealed.org`.
2. In GoDaddy's `prayersealed.org` DNS zone, set a CNAME named `scripture` to the exact service hostname Render displays (ending in `.onrender.com`). Do not point it to GitHub Pages.
3. Verify the custom domain in Render and wait for its HTTPS certificate.
4. Set the Render environment variable `NEXTAUTH_URL=https://scripture.prayersealed.org` and redeploy; update any configured authentication callback allowlists as needed.
5. Verify the homepage, lessons, copied lesson links, and sign-in on the new domain before redirecting the old address.

Browser-local progress and installed PWAs belong to their original origin and do not automatically migrate. Keep the old domain accessible until any required progress migration has been handled.
