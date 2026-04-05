import { SiteShell } from '../components/SiteShell';

export function AboutPage() {
  return (
    <SiteShell
      title="About HealthyPixel"
      subtitle="Built for privacy, speed, and practical daily health tracking."
    >
      <section className="about-layout" aria-label="About HealthyPixel">
        <article className="doc-card">
          <h2>Our Mission</h2>
          <p>
            HealthyPixel exists to help people track health signals without surveillance patterns,
            without account lock-in, and without complicated setup.
          </p>
          <p>
            The goal is simple: high-quality tracking experience that respects user ownership and
            keeps usage friction low.
          </p>
        </article>

        <article className="doc-card">
          <h2>Technical Priorities</h2>
          <ul>
            <li>Low cost and low maintenance architecture.</li>
            <li>Reusable components and minimal one-off code.</li>
            <li>Lightweight delivery for GitHub Pages constraints.</li>
            <li>Performance and accessibility as release requirements.</li>
            <li>Local-first data handling with user control.</li>
          </ul>
        </article>

        <article className="doc-card">
          <h2>Current Scope</h2>
          <p>This initial build intentionally includes focused routes for stable validation:</p>
          <ol>
            <li>In-App Documentation page</li>
            <li>Tests page for shared component validation</li>
            <li>About Us page</li>
          </ol>
          <p>
            After hosting and testing these pages, feature work can continue in controlled,
            test-first increments.
          </p>
        </article>
      </section>
    </SiteShell>
  );
}
