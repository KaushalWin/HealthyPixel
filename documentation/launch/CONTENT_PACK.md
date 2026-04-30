# HealthyPixel Launch Content Pack

Status: Draft for launch prep

Use this pack only after the P0 items in [LAUNCH_AUDIT.md](./LAUNCH_AUDIT.md) are resolved.

This content intentionally stays inside the current validated product scope:

- local-first health logging
- sugar, food, blood pressure, weight, and height tracking
- charts and filtering
- full-app JSON backup and restore from Settings
- optional AI health chat with user-provided key
- browser-local key save only when explicitly requested by the user
- PWA installability targets

## 1. Release Notes

### Short Version

HealthyPixel is a privacy-first health tracker that runs in your browser and keeps your data on your device. This build supports sugar, food, blood pressure, weight, and height logging, plus chart views, tag-based filtering, installable PWA behavior, and optional AI health chat using your own provider key.

### Full Version

HealthyPixel is built for people who want quick health tracking without creating an account or sending personal readings to a server.

Current launch scope includes:

- Sugar tracking with tags, filtered history, and trend charts.
- Food tracking with four tag categories: planned, actual, context, and behavior.
- Blood pressure, weight, and height logging with chart views.
- Dashboard and settings controls for chart colors and module visibility.
- Full-app JSON export/import from Settings for manual backup and restore.
- Optional AI health chat using a user-supplied provider key.
- Explicit local save for AI keys with a warning that saved keys stay in your browser data.
- PWA packaging for installable use on supported devices.

### Known Limitation To State Honestly

HealthyPixel uses manual JSON backup and restore, not cloud sync. CSV export, merge import, and device-to-device sync are not part of this launch build.

## 2. FAQ

### What is HealthyPixel?

HealthyPixel is a local-first health tracker for logging sugar, food, blood pressure, weight, and height in a fast browser-based app.

### Where is my data stored?

Your readings stay in your browser storage on your device. HealthyPixel is designed to avoid sending your health logs to a backend.

### Do I need an account?

No. The app is designed to work without sign-up.

### Does HealthyPixel track me?

No analytics or behavior tracking are part of the product promise. The app is positioned as privacy-first and local-first.

### What can I track today?

You can track sugar, food, blood pressure, weight, and height, then review charts and filtered history for each module.

### How does food tracking work?

Food entries support four tag groups so you can log intent and outcome separately:

- planned tags
- actual tags
- context tags
- behavior tags

This makes it easier to see patterns like planned healthy meals turning into overeating during stressful dinners.

### Does the AI feature use my own API key?

Yes. The AI health chat uses a user-supplied key.

### Does HealthyPixel store my AI key?

Not by default. You can use a key for the current session only. If you choose Save locally, the key is stored in your own browser data for that provider.

### Is saving the AI key safe?

It is browser-local, not server-side. It is still safer to avoid saving on shared devices.

### Can I install it like an app?

Yes, on supported browsers and devices. HealthyPixel is packaged as a PWA with launcher shortcuts.

### Can I export my data?

Yes. You can export the full app data as JSON from Settings and import that same JSON later to restore readings, tags, and settings on another local app instance.

## 3. Landing Page Copy

### Hero Headline

Track your health privately, right in your browser.

### Hero Subheadline

HealthyPixel helps you log sugar, food, blood pressure, weight, and height without accounts, without analytics, and without sending your readings to a server.

### Primary CTA

Start tracking

### Secondary CTA

See how privacy works

### Three Supporting Value Points

- Local-first: your health logs stay on your device.
- Fast entry: quick add flows with minimal taps.
- Useful patterns: charts, filters, and categorized food tags for better review.

### Food Feature Section

Food tracking that captures intent and outcome.

HealthyPixel separates food tags into planned, actual, context, and behavior categories so you can log more than calories. Track what you meant to eat, what actually happened, and what surrounded the meal.

### AI Feature Section

Optional AI health chat, on your terms.

Use your own API key for AI-assisted reflection. HealthyPixel does not require AI to use the app, and saving a key is optional and browser-local only.

### Privacy Section

No account. No cloud health vault. No silent tracking.

HealthyPixel is built for people who want a simple, privacy-first way to log health data locally and review trends without handing over their readings.

## 4. Product Hunt Draft

### Tagline

Privacy-first health tracking for sugar, food, BP, weight, and height.

### Launch Post

HealthyPixel is a local-first health tracker built for people who want fast logging without accounts or analytics.

This launch build includes:

- sugar tracking
- food tracking with planned, actual, context, and behavior tags
- blood pressure, weight, and height logging
- charts and filterable history
- full-app JSON backup and restore from Settings
- installable PWA support
- optional AI health chat with your own API key

The goal was simple: fewer taps, clearer trends, and better privacy defaults.

I would especially love feedback on:

- first-run clarity
- food filter usability
- chart usefulness
- trust signals around privacy and local storage

## 5. Reddit Post Drafts

### Variant A: Build Feedback

Title: I built a privacy-first health tracker that keeps readings in the browser. Looking for feedback.

Body:

I’ve been working on HealthyPixel, a local-first health tracker that focuses on fast logging and keeping data on-device.

Current scope includes sugar, food, blood pressure, weight, and height tracking, plus charts, filters, and an optional AI health chat that uses your own API key.

One thing I’m specifically testing is food tracking with four tag groups: planned, actual, context, and behavior. The idea is to capture what you meant to eat, what happened, and why.

If you try it, I’d really value feedback on:

- whether first-time setup feels clear
- whether the food filters are understandable
- whether the privacy messaging feels trustworthy enough

### Variant B: Privacy Angle

Title: A browser-based health tracker without accounts, analytics, or server-side health logs.

Body:

HealthyPixel is an attempt to keep health tracking simple and private.

It runs as a browser app, supports sugar, food, BP, weight, and height logging, and is designed so the data stays in local browser storage on your device.

There’s also an optional AI health chat, but it only works with a user-provided API key, and saving that key locally is opt-in.

I’m trying to pressure-test whether this privacy-first direction is actually compelling to people who have stopped trusting more account-heavy trackers.

### Variant C: Food Tracking Angle

Title: I added a food tracker that separates planned eating from actual eating, context, and behavior.

Body:

Most food logs flatten everything into one note or one tag list.

In HealthyPixel, food entries can carry four different tag categories:

- planned
- actual
- context
- behavior

So a single entry can capture something like “planned healthy + high-protein, actual overeat + heavy, context dinner, behavior bored binge.”

I’m curious whether that structure is useful in practice or just interesting on paper. Feedback on the tracking model and chart/filter design would help a lot.

## 6. SEO Metadata Draft

### Meta Description

HealthyPixel is a privacy-first health tracker for sugar, food, blood pressure, weight, and height with local-first storage, charts, and optional AI chat.

### Meta Keywords

privacy first health tracker, local health tracker, sugar tracker, food tracker, blood pressure tracker, weight tracker, height tracker, PWA health app, browser health log

### Open Graph Description

Track sugar, food, blood pressure, weight, and height in a privacy-first app that keeps data on your device.

### Twitter Description

HealthyPixel is a local-first health tracker with fast logging, charts, food tags, and optional AI chat using your own API key.

### Structured Data Feature List Draft

- Sugar tracking
- Food tracking
- Blood pressure tracking
- Weight tracking
- Height tracking
- Optional AI health chat
- PWA installability

## 7. Messaging Guardrails

Use these consistently in launch copy:

- Say “privacy-first” only when the current UI and docs back it up.
- Say “local-first” instead of implying encrypted cloud sync.
- Say “optional AI chat” and “use your own API key.”
- Say “save locally in your browser” for AI keys, not “secure vault.”
- Say “full-app JSON backup and restore” instead of implying live sync or conflict-aware merge.
- Do not claim medical advice, diagnosis, treatment, or clinician-grade analysis.

## 8. Recommended Publish Order

1. Fix all P0 issues in [LAUNCH_AUDIT.md](./LAUNCH_AUDIT.md).
2. Update trust surfaces in-app: About, privacy, FAQ, metadata.
3. Validate PWA behavior on real devices.
4. Publish landing copy and release notes.
5. Use Product Hunt and Reddit variants only after the product copy matches the deployed build.