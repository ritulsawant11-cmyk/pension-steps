import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GuidedJourneyFlow } from './components/GuidedJourneyFlow';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import { OldPensionJourneyState } from './types';

const createInitialJourneyState = (): OldPensionJourneyState => ({
  knownDetails: [],
  readinessStatus: {
    policy_number: 'unsure',
    ni_number: 'unsure',
    names: 'have',
    addresses: 'look',
    employment_dates: 'look',
    employer_name: 'look',
    provider_or_scheme: 'look',
    paperwork: 'look',
  },
  selectedQuestionIds: {},
  userNotes: '',
  activeStep: 1,
});

export const App: React.FC = () => {
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [journeyState, setJourneyState] = useState<OldPensionJourneyState>(createInitialJourneyState);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleStartJourney = () => {
    setIsJourneyActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setIsJourneyActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAgain = () => {
    setJourneyState(createInitialJourneyState());
    setIsJourneyActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateJourneyState = (updates: Partial<OldPensionJourneyState>) => {
    setJourneyState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleScrollToHowItWorks = () => {
    if (isJourneyActive) {
      setIsJourneyActive(false);
      setTimeout(() => {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToResources = () => {
    if (isJourneyActive) {
      setIsJourneyActive(false);
      setTimeout(() => {
        document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      <Header
        onHomeClick={handleHomeClick}
        onAboutClick={() => setIsAboutOpen(true)}
        onStartJourney={handleStartJourney}
        onHowItWorksClick={handleScrollToHowItWorks}
        onResourcesClick={handleScrollToResources}
      />

      <main id="main-content" tabIndex={-1}>
        {!isJourneyActive ? (
          <>
            {/* 1. Hero Section */}
            <Hero
              onFindNextStep={handleStartJourney}
              onHowItWorksClick={handleScrollToHowItWorks}
            />

            {/* 2. Three Simple Steps Section */}
            <section
              id="how-it-works-section"
              className="section how-it-works-section"
              aria-labelledby="how-it-works-title"
            >
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">01 / HOW IT WORKS</div>
                  <h2 id="how-it-works-title" className="section-title section-main-heading">
                    Three simple <em>steps.</em>
                  </h2>
                  <p className="section-sub section-lead-paragraph">
                    Preparing beforehand keeps your enquiry structured, avoids security rejections, and prevents missed questions.
                  </p>
                </div>

                <div className="how-it-works-grid">
                  <div className="how-step-card">
                    <span className="how-step-badge">01</span>
                    <h3 className="how-step-title">Tell us what you know</h3>
                    <p className="how-step-desc">
                      Select what details or paperwork you still have, or start with very little. It’s okay if you don’t remember everything.
                    </p>
                  </div>

                  <div className="how-step-card">
                    <span className="how-step-badge">02</span>
                    <h3 className="how-step-title">Review what to have ready</h3>
                    <p className="how-step-desc">
                      Organise key information like your NI number and employment dates without entering them online.
                    </p>
                  </div>

                  <div className="how-step-card">
                    <span className="how-step-badge">03</span>
                    <h3 className="how-step-title">Create your enquiry plan</h3>
                    <p className="how-step-desc">
                      Print or download your 1-page call plan with tailored questions, contact guidance, and dedicated note-taking space.
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleStartJourney}
                  >
                    <span>Prepare my pension enquiry</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 3. About & Safeguards Section */}
            <section
              id="about-section"
              className="section safeguards-split-section"
              aria-labelledby="about-section-title"
            >
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">02 / ABOUT &amp; SAFEGUARDS</div>
                  <h2 id="about-section-title" className="section-title section-main-heading">
                    Independent enquiry <em>preparation.</em>
                  </h2>
                </div>

                <div className="about-grid safeguards-split-grid">
                  <div className="about-content-col safeguards-content-col">
                    <p className="about-copy">
                      PensionSteps helps people prepare to contact a pension provider about an old pension when they have incomplete information.
                    </p>
                    <p className="about-sub section-lead-paragraph">
                      When tracing historic pensions, it helps to keep three distinct concepts in mind:
                    </p>

                    <ol style={{ margin: '0 0 20px 20px', padding: 0, fontSize: '0.94rem', color: 'var(--ink)', lineHeight: '1.7' }}>
                      <li>
                        <strong>Identifying an organisation to contact:</strong> Finding the former employer’s HR contact or current scheme administrator.
                      </li>
                      <li>
                        <strong>Asking that organisation to search for a record:</strong> Providing approximate dates and names so they can query archived files.
                      </li>
                      <li>
                        <strong>Completing identity and security checks:</strong> Providing official identification before any financial or policy data is disclosed.
                      </li>
                    </ol>

                    <div className="safeguards-btn-wrap" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-primary-teal"
                        onClick={() => setIsAboutOpen(true)}
                      >
                        <span>Read our full safeguards &amp; service boundaries</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>

                  <div className="about-skills-col">
                    <ul className="skill-list safeguards-pill-list">
                      <li>&#10003; Free to use</li>
                      <li>&#10003; No account needed</li>
                      <li>&#10003; Zero personal data collected</li>
                      <li>&#10003; Independent preparation — not financial advice</li>
                      <li>&#10003; Does not search provider databases</li>
                      <li>&#10003; Plain English checklists</li>
                      <li>&#10003; Printable 1-page call plan</li>
                      <li>&#10003; In-memory browser session only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Official Resources Section */}
            <section
              id="resources-section"
              className="section"
              aria-labelledby="resources-title"
            >
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">OFFICIAL UK RESOURCES</div>
                  <h2 id="resources-title" className="section-title section-main-heading">
                    Verified government &amp; public <em>guidance.</em>
                  </h2>
                  <p className="section-sub section-lead-paragraph">
                    Free statutory services that help you find contact details and resolve pension questions.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div className="project-card" style={{ padding: '28px' }}>
                    <div className="project-meta">GOV.UK STATUTORY TOOL</div>
                    <h3 className="card-title-heading">Find pension contact details</h3>
                    <p className="card-summary-desc">
                      The official government database holding contact details for workplace and personal schemes. It finds contact details only; it does not verify individual pots or values.
                    </p>
                    <div className="card-bottom-action">
                      <a
                        href="https://www.gov.uk/find-pension-contact-details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-link"
                      >
                        <span>Visit gov.uk/find-pension-contact-details</span>
                        <span className="btn-card-arrow-circle" aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="project-card" style={{ padding: '28px' }}>
                    <div className="project-meta">MONEYHELPER SERVICE</div>
                    <h3 className="card-title-heading">Tracing and finding lost pensions</h3>
                    <p className="card-summary-desc">
                      Backed by HM Government, MoneyHelper offers comprehensive guidance on how to track down forgotten workplace and personal pensions step by step.
                    </p>
                    <div className="card-bottom-action">
                      <a
                        href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-link"
                      >
                        <span>Read MoneyHelper tracing guide</span>
                        <span className="btn-card-arrow-circle" aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. FAQ Section */}
            <section className="section faq-section" id="faq-section" aria-labelledby="faq-main-title">
              <div className="container">
                <div className="section-header section-center-header">
                  <div className="section-number">03 / FAQ</div>
                  <h2 id="faq-main-title" className="section-title section-main-heading">
                    Frequently asked <em>questions.</em>
                  </h2>
                  <p className="section-sub section-lead-paragraph">
                    Common practical questions about contacting pension administrators with missing details.
                  </p>
                </div>

                <div className="faq-grid">
                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> What if I only remember my former employer’s name?
                    </h3>
                    <p className="faq-answer-text">
                      That is a very common starting point. Your former employer’s HR department or the government Pension Tracing Service can help you identify the scheme administrator who manages records for that employer.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> Does having my National Insurance number mean a pension will be found?
                    </h3>
                    <p className="faq-answer-text">
                      No. A National Insurance number helps providers check archived records, but a match depends on whether scheme records were digitised and kept up to date. It does not guarantee a policy exists or replace formal identity checks.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> Can PensionSteps look up my pension or contact providers?
                    </h3>
                    <p className="faq-answer-text">
                      No. PensionSteps is an independent customer-preparation tool. It does not access pension provider databases or submit enquiries on your behalf. All preparations remain private in your browser.
                    </p>
                  </article>

                  <article className="faq-card">
                    <h3 className="faq-question-title">
                      <span className="faq-q-indicator">Q.</span> What if I don’t remember my old address?
                    </h3>
                    <p className="faq-answer-text">
                      Note down the town, approximate area, or street you remember. Inform the provider honestly that your address history is incomplete. They have procedures for searching archived files with unconfirmed addresses and will specify what proof of identity they require.
                    </p>
                  </article>
                </div>
              </div>
            </section>

            {/* 6. CTA Callout */}
            <section className="section cta-callout-section" aria-labelledby="cta-callout-heading">
              <div className="container">
                <div className="contact-panel cta-callout-card">
                  <div className="contact-panel-content cta-callout-text">
                    <h2 id="cta-callout-heading" className="cta-callout-title">
                      Ready to prepare your <em>enquiry?</em>
                    </h2>
                    <p className="cta-callout-desc">
                      Organise what you remember, review what to have ready, and create your printable enquiry plan in minutes.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary btn-callout-action"
                      onClick={handleStartJourney}
                    >
                      <span>Prepare my pension enquiry</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <GuidedJourneyFlow
            state={journeyState}
            onUpdateState={handleUpdateJourneyState}
            onHomeClick={handleHomeClick}
            onStartAgain={handleStartAgain}
          />
        )}
      </main>

      <Footer
        onAboutClick={() => setIsAboutOpen(true)}
        onHowItWorksClick={handleScrollToHowItWorks}
        onResourcesClick={handleScrollToResources}
        onStartJourney={handleStartJourney}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default App;
