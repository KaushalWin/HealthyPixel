import { DONATION_LINKS, DONATION_TEXT } from '../lib/monetization';

export function MonetizationPanel() {
  return (
    <section className="monetization-panel" aria-label="Support and feature requests">
      <div className="monetization-panel__copy">
        <h2>{DONATION_TEXT.heading}</h2>
        <p>{DONATION_TEXT.message}</p>
        <div className="action-row compact">
          <a
            className="primary-button"
            href={DONATION_LINKS.githubSponsorsProfile}
            target="_blank"
            rel="noreferrer"
          >
            Sponsor on GitHub
          </a>
        </div>
      </div>

      <div className="monetization-panel__card-wrap">
        <iframe
          src={DONATION_LINKS.githubSponsorsCard}
          title="Sponsor KaushalWin"
          className="monetization-panel__iframe"
          loading="lazy"
        />
      </div>
    </section>
  );
}