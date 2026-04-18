# 📱 NewsApp — Hacker News Reader

> Production-ready React Native app with TypeScript, offline support, and bookmark persistence

![React Native](https://img.shields.io/badge/React_Native-0.85-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-FF6600?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Technical Q&A](#technical-qa)
- [What I'd Do Differently](#what-id-do-differently)

---

## Features

| Feature | Description |
|---------|-------------|
| 📰 Top Stories | Browse top 20 Hacker News stories |
| 🔍 Search | Filter stories by title with debouncing |
| 📌 Bookmarks | Save stories with AsyncStorage persistence |
| 🗑️ Swipe to Delete | Remove bookmarks with gesture handler |
| 📡 Network Status | Offline/online banner with auto-retry |
| 📤 Share Stories | Share via native share sheet |
| 🌐 Open in Browser | External link handling |
| 📱 Responsive | Works on iOS and Android |

---

## Architecture
┌────────────────────────────────────────────┐
│           UI Layer (Screens)               │
│  ArticleList │ ArticleDetail │ Bookmarks   │
└──────────────────┬─────────────────────────┘
│
┌──────────────────▼─────────────────────────┐
│         Custom Hooks Layer                 │
│  useArticleList │ useArticleDetail         │
│  useBookmarks   │ useNetworkStatus         │
└──────────────────┬─────────────────────────┘
│
┌──────────────────▼─────────────────────────┐
│         State Layer (Zustand)              │
│  useNewsStore │ useBookmarkStore           │
│  useUIStore                                │
└──────────────────┬─────────────────────────┘
│
┌──────────────────▼─────────────────────────┐
│             API Layer                      │
│         HackerNews API Client              │
└────────────────────────────────────────────┘

### Why Zustand?

- **Zero boilerplate** — no providers, no actions, no reducers
- **TypeScript first** — full type inference out of the box
- **Selective re-renders** — components only update when their slice changes
- **Simple persistence** — one line of config for AsyncStorage

### Why AsyncStorage?

- **Reliable cold starts** — bookmarks survive app restarts
- **No native issues** — works without New Architecture
- **Easy debugging** — stored data is easy to inspect

---

## Project Structure
src/
├── api/                    # HackerNews API client + endpoints
├── components/shared/      # Button, Card, EmptyState, LoadingSpinner
├── hooks/                  # useArticleList, useBookmarks, useNetworkStatus, useDebounce
├── navigation/             # BottomNavigator + StackNavigator
├── screens/                # ArticleList, ArticleDetail, BookmarksScreen
├── store/                  # useNewsStore, useBookmarkStore, useUIStore
├── theme/                  # colors, spacing, typography
├── types/                  # story, navigation, bookmarks
└── utils/                  # dateUtils, errorUtils

---

## Quick Start

**1. Clone & install**
```bash
git clone <your-repo>
cd NewsApp
npm install
```

**2. iOS setup** *(Mac only)*
```bash
cd ios && pod install && cd ..
```

**3. Android** — add to `android/build.gradle`:
```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri(project(":react-native-async-storage_async-storage").file("local_repo"))
        }
    }
}
```

**4. Run**
```bash
npm run android
npm run ios
```

**Troubleshooting**
```bash
npx react-native start --reset-cache
cd android && ./gradlew clean && cd ..
rm -rf node_modules package-lock.json && npm install
```

### Required Versions

| Tool | Version |
|------|---------|
| Node | >= 22.11.0 |
| React Native | 0.85.1 |
| Android SDK | API 34+ |
| iOS | 13.0+ |

---

## Tech Stack

| Core | Version | Navigation | Version |
|------|---------|------------|---------|
| React Native | 0.85.1 | @react-navigation/native | 7.2.2 |
| TypeScript | 5.8.3 | bottom-tabs | 7.15.9 |
| Zustand | 5.0.12 | native-stack | 7.14.11 |

| Storage | Version | UI | Version |
|---------|---------|-----|---------|
| async-storage | 3.0.2 | gesture-handler | 2.31.1 |
| netinfo | 12.0.1 | safe-area-context | 5.7.0 |
| mmkv | 2.12.2 | vector-icons | 10.3.0 |

---

## Technical Q&A

**Q1 — Bridge vs JSI & The New Architecture**

React Native's legacy Bridge serialized every JS↔native interaction as JSON, which added overhead on every call. JSI removes that entirely by letting JavaScript hold direct references to native objects — no serialization needed. Fabric (new renderer) and TurboModules (new module system) build on JSI for synchronous rendering and lazy-loaded native modules. The practical result is smoother animations and better UI responsiveness in complex apps.

**Q2 — Diagnosing a janky FlatList**

Start with the RN perf monitor for FPS and memory, then profile in Flipper. Code-level fixes: `React.memo` on `renderItem`, `useCallback` on all handlers, and FlatList props `windowSize={5}`, `maxToRenderPerBatch={10}`, `removeClippedSubviews={true}`. For images: fixed dimensions and proper caching. Always audit for inline functions or styles inside the list — they silently cause re-renders on every scroll frame.

**Q3 — useCallback and useMemo**

`useCallback` stabilizes callbacks passed to children inside large lists — without it every parent re-render creates a new function reference, forcing unnecessary child re-renders. `useMemo` earns its place when computing expensive derived data like filtering or sorting a large dataset. The anti-pattern is wrapping trivial math in `useMemo` — the caching overhead then costs more than just recalculating. These are surgical tools, not defaults.

**Q4 — State management decision**

Zustand was the right call here. Context API causes unnecessary re-renders at scale. Redux Toolkit is powerful but the boilerplate slows down iteration. Zustand hits the sweet spot: minimal setup, built-in persistence, excellent TypeScript support. I'd only revisit Redux if the team grew significantly or if complex selector memoization became a real bottleneck.

**Q5 — Offline-first UX strategy**

NetInfo for connectivity detection, AsyncStorage + Zustand persistence middleware for local caching, and a stale-while-revalidate pattern: show cached content immediately, refresh in the background on reconnect. The trade-off is users occasionally see stale data — the benefit is the app feels reliable in poor network conditions, which matters more than freshness for a news reader.

---

## What I'd Do Differently

If I had more time, the first thing I'd tackle is **proper error boundaries**. Right now, errors at the screen level bubble up without graceful fallback UI — in production that's a crash, not a friendly message. I'd add React error boundaries at the navigation level and per-screen, with retry logic hooked into the stores.

I'd also fully wire up **MMKV** for bookmark storage instead of AsyncStorage. I included it in the stack but didn't complete the integration — MMKV is synchronous and significantly faster for small key-value reads on cold starts. The difference is invisible with a handful of bookmarks, but it's the right default for a production app.

The **test coverage is honest: there isn't any**. I'd add unit tests for the Zustand stores and custom hooks using `@testing-library/react-hooks`, and at least one integration test per screen with mocked API responses. The hooks layer was deliberately kept thin to make this easy — I just didn't get there in time.

The **search is local-only** right now — it filters whatever's already in the top 20. A much better experience would hit the Algolia HN Search API for server-side search across all stories. I scoped it down deliberately, but it's the first thing I'd ship with more time.

I'd also add **authentication** — letting users log in with their HN account to upvote, comment, and sync bookmarks across devices. The Zustand auth store and protected route pattern are straightforward to add, and it would make the app genuinely useful rather than just a reader.

Finally, **performance and animations** deserve more attention. The list transitions are functional but flat. With Reanimated 3 I'd add shared element transitions between the list and detail screens, spring-based bookmark animations, and skeleton loaders instead of spinners. These aren't polish — on mobile, motion is how you communicate that the app is fast and alive.

---

## License

MIT — free to use, modify, share.

> Made with ❤️ using React Native