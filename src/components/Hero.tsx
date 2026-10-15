import React from 'react';

interface HeroProps {
  onFindNextStep: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onFindNextStep, onHowItWorksClick }) => {
  return (
    <section className="hero hero-section" aria-labelledby="hero-main-heading">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column Content */}
          <div className="hero-left-col">
            <div className="availability hero-service-badge">
              Independent pension-enquiry preparation tool
            </div>

            <h1 id="hero-main-heading" className="hero-headline">
              An old pension. Missing details. <em>A clearer next step.</em>
            </h1>

            <p className="hero-intro hero-subtext">
              Not sure of your policy number, old address or pension provider? Organise what you remember and prepare for your next enquiry.
            </p>

            <div className="hero-actions hero-buttons-row">
              <button
                type="button"
                className="btn btn-primary btn-primary-teal"
                onClick={onFindNextStep}
                id="hero-prepare-btn"
              >
                <span>Prepare my pension enquiry</span>
                <span className="btn-arrow-icon" aria-hidden="true">&rarr;</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-secondary-link"
                onClick={onHowItWorksClick}
              >
                <span>See how it works</span>
              </button>
            </div>

            <div className="hero-reassurance-text">
              PensionSteps is an independent preparation tool. It does not search for pensions or contact providers on your behalf. Free to use. No account needed.
            </div>
          </div>

          {/* Right Column: Fieldnotes Notebook Call-Plan Preview */}
          <div className="hero-preview-col" aria-label="Example call plan preview">
            <div className="notebook example-plan-card">
              {/* Top Badge Bar */}
              <div className="notebook-top example-plan-top-bar">
                <span className="example-plan-badge">PENSIONSTEPS CALL PLAN • YOUR CALL PLAN</span>
                <span className="example-plan-chip">A4 Printable • Example</span>
              </div>

              <h2 className="notebook-title">Example call plan</h2>

              <div className="plan-preview-sections">
                {/* Section 1: What I want to discuss */}
                <div className="preview-block example-plan-section">
                  <div className="preview-block-heading plan-section-label">What I want to discuss</div>
                  <div className="preview-block-content">
                    Found an old pension letter from a former employer scheme. Check current status, scheme administrator contact details, and transfer value.
                  </div>
                </div>

                {/* Section 2: Information to have ready */}
                <div className="preview-block example-plan-section">
                  <div className="preview-block-heading plan-section-label">Information to have ready / Before you call</div>
                  <ul className="example-checklist-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>&#10003; Letter reference &amp; policy number</li>
                    <li>&#10003; National Insurance number</li>
                    <li>&#10003; Former employer start &amp; leave dates</li>
                  </ul>
                </div>

                {/* Section 3: Questions to ask */}
                <div className="preview-block example-plan-section">
                  <div className="preview-block-heading plan-section-label">Questions to ask</div>
                  <div className="example-question-box">
                    <div className="example-q-item">1. What information is needed to confirm my record?</div>
                    <div className="example-q-item">2. What happens next and what are current processing times?</div>
                  </div>
                </div>

                {/* Section 4: Notes and next steps */}
                <div className="preview-block">
                  <div className="preview-block-heading">Notes and next steps</div>
                  <div className="preview-block-content">Adviser name: ___________________ | Ref: _________</div>
                </div>
              </div>

              <div className="stamp" aria-hidden="true">
                EXAMPLE<br />CALL PLAN<br />✳
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
