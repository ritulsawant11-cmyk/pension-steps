import React from 'react';

interface FooterProps {
  onAboutClick: () => void;
  onHowItWorksClick: () => void;
  onResourcesClick: () => void;
  onStartJourney: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onAboutClick,
  onHowItWorksClick,
  onResourcesClick,
  onStartJourney,
}) => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-row">
          <div className="footer-brand">
            <div className="brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="brand-mark" aria-hidden="true">p</span>
              <strong className="brand-name" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>PensionSteps</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              An independent UK pension-enquiry preparation tool. Free to use • No account needed • Zero personal data stored
            </p>
          </div>

          <ul className="footer-nav-list">
            <li>
              <button type="button" className="footer-nav-link" onClick={onStartJourney}>
                Prepare my enquiry
              </button>
            </li>
            <li>
              <button type="button" className="footer-nav-link" onClick={onHowItWorksClick}>
                How it works
              </button>
            </li>
            <li>
              <button type="button" className="footer-nav-link" onClick={onAboutClick}>
                About &amp; Safeguards
              </button>
            </li>
            <li>
              <button type="button" className="footer-nav-link" onClick={onResourcesClick}>
                Official resources
              </button>
            </li>
          </ul>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px', marginTop: '16px' }}>
          <p className="footer-disclaimer-text">
            PensionSteps is an independent preparation tool. It does not provide financial advice, access pension accounts or submit requests to providers. Requirements vary; check directly with your provider.
          </p>
        </div>

        <div className="footer-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} PensionSteps. Independent UK pension-enquiry preparation tool. Zero personal data collected.
          </p>
          <p style={{ margin: 0 }}>
            Design inspired by Fieldnotes Student by Colorlib (CC BY 3.0).
          </p>
        </div>
      </div>
    </footer>
  );
};
