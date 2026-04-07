# PixieTrack SEO & Visibility Playbook

This document is an execution-focused guide for improving discovery and getting more views for PixieTrack.

Use this with `documentation/strategy/SEO_MARKETING.md`:
- `documentation/strategy/SEO_MARKETING.md` = strategy and messaging
- `documentation/SEO_VISIBILITY_PLAYBOOK.md` = implementation checklist and operations

## 1. Goals and KPIs

Primary goals:
- Increase relevant organic traffic
- Improve install intent from search visitors
- Grow direct and referral traffic from communities

Track these KPIs monthly:
- Clicks from Google Search
- Impressions in Google Search
- Average CTR by top queries
- Average position for target pages
- Top landing pages by sessions
- Install-related actions (for example: PWA install clicks)
- Returning users (privacy-safe aggregate tracking only if policy allows)

## 2. Google Search Setup (First Week)

1. Verify ownership in Google Search Console.
2. Submit sitemap URL.
3. Check indexing status for:
- `/`
- `/#/help`
- `/#/about`
4. Resolve coverage warnings (soft 404, blocked resources, canonical issues).
5. Re-submit sitemap after major content updates.

Recommended sitemap URL pattern:
- `https://kaushalwin.github.io/PixieTrack/sitemap.xml`

## 3. On-Page SEO Essentials

Apply these to `index.html` and major routes:

1. Title tag:
- Keep between 50 to 60 characters.
- Include core keyword and brand.

2. Meta description:
- Keep between 140 to 160 characters.
- Explain value clearly: offline, private, easy logging.

3. Open Graph and Twitter cards:
- Keep share title/description consistent with page intent.
- Use a readable social preview image.

4. Heading structure:
- Exactly one H1 per page.
- Use H2/H3 in logical order.

5. Internal links:
- Link documentation pages to feature pages and back.
- Use descriptive anchor text (not generic "click here").

6. Accessibility and SEO alignment:
- Add alt text for meaningful images.
- Keep color contrast and semantic structure clean.

## 4. Technical SEO Checklist

1. Ensure deploy path is correct:
- `PIXIETRACK_BASE_PATH` must match repository path for project pages.

2. Keep core web vitals healthy:
- Minimize render-blocking assets.
- Avoid unnecessary large JS chunks.
- Compress and optimize images.

3. Crawl/index safety:
- Keep `robots.txt` and `sitemap.xml` valid.
- Use canonical tags for preferred URL.
- Avoid duplicate title/description across important pages.

4. Performance hygiene:
- Audit with Lighthouse monthly.
- Fix regressions in LCP, CLS, and INP.

5. Mobile-first quality:
- Test key pages on real mobile viewport sizes.
- Keep font sizes and tap targets accessible.

## 5. Content Plan for Search Growth

Publish useful pages that match real user intent:

1. Educational pages:
- How to track sugar readings daily (simple workflow)
- How to interpret ranges safely (general guidance, no medical claims)
- How to use tags effectively for meal context

2. Product pages:
- Feature page for Add Sugar flow
- Feature page for Chart and insights
- Feature page for Settings and tag ranges

3. Trust pages:
- Privacy model explained (local-first, no backend)
- Data ownership and export story

Content cadence:
- Publish at least 2 quality updates per month.
- Refresh existing top pages every 6 to 8 weeks.

## 6. Traffic Channels Beyond Google

1. Community distribution:
- Reddit communities (health tracking, privacy, PWAs)
- Indie Hackers
- Hacker News (launch and technical write-up)
- Relevant Discord/Slack groups

2. Social distribution:
- X (Twitter) short educational threads
- LinkedIn creator/dev updates
- YouTube shorts or demo clips of real workflows

3. Developer ecosystem:
- Post technical breakdown of local-first architecture
- Share PWA implementation lessons
- Submit to "awesome" lists where relevant

4. Partnerships:
- Collaborate with privacy-focused creators
- Exchange newsletter mentions with aligned indie apps

## 7. Conversion Optimization (Views to Users)

1. First-screen clarity:
- Clearly state value in the first viewport.
- Explain install and usage in under 10 seconds of reading.

2. Strong call-to-action:
- Use a single primary CTA (for example, install/use now).
- Keep secondary CTA for documentation.

3. Reduce friction:
- Minimize taps for first action.
- Keep onboarding lightweight and optional.

4. Trust signals:
- Privacy-first messaging near CTA
- No account required
- Local-only data handling

## 8. Monthly Operating Routine

Week 1:
- Review Search Console queries/pages
- Pick 2 pages to improve CTR and ranking

Week 2:
- Publish one new intent-focused page
- Update one older page

Week 3:
- Run Lighthouse and fix top 3 issues
- Improve internal links between docs and feature pages

Week 4:
- Distribute content in 2 to 3 communities
- Summarize results and keep what worked

## 9. Copy Templates

Search snippet style title ideas:
- PixieTrack: Private Offline Health Tracker PWA
- PixieTrack Sugar Tracking: Fast Local-First Logging

Meta description template:
- PixieTrack helps you log sugar readings quickly with privacy-first local storage. Works offline, installs as a PWA, and keeps your data on your device.

Community launch template:
- Built PixieTrack, a privacy-first offline health tracker PWA. No backend, no account, local-only storage. Looking for feedback on usability and clarity of the sugar tracking flow.

## 10. Compliance and Safety Notes

1. Avoid medical outcome claims unless legally reviewed.
2. Prefer "supports tracking" language over treatment claims.
3. Keep privacy statements accurate and implementation-aligned.
4. If you add analytics later, update privacy docs in the same change.

## 11. Definition of Done (SEO Release)

A release is SEO-ready when:
1. Title, description, canonical, OG tags are reviewed.
2. Sitemap and robots are valid and deployed.
3. Top landing pages pass a basic Lighthouse threshold.
4. Search Console has no critical indexing errors.
5. Internal links to key pages are present and tested.
