import { SiteShell } from '../components/SiteShell';
import { APP_NAME } from '../lib/branding';

export function AboutPage() {
  return (
    <SiteShell
      title={`About ${APP_NAME}`}
      subtitle="Built for privacy, speed, and practical daily health tracking."
    >
      <section className="about-layout" aria-label={`About ${APP_NAME}`}>
        <article className="doc-card">
          <h2>Our Mission</h2>
          <p>
            {APP_NAME} exists to help people track health signals without surveillance patterns,
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
          <p>This build now includes the first practical sugar-tracking workflow with local settings and testing infrastructure:</p>
          <ol>
            <li>In-App Documentation page</li>
            <li>Add Sugar page</li>
            <li>Sugar List page</li>
            <li>Sugar Chart page</li>
            <li>Settings pages</li>
            <li>Tests page for shared component validation</li>
            <li>About Us page</li>
          </ol>
          <p>
            New functionality is still built through reusable components, local storage, and the
            Tests page before it is spread across production screens.
          </p>
        </article>
      </section>
    </SiteShell>
  );
}
