import React from 'react';
import { JourneyData, JourneyId } from '../types';

interface JourneyCardsProps {
  journeys: JourneyData[];
  onSelectJourney: (id: JourneyId) => void;
}

export const JourneyCards: React.FC<JourneyCardsProps> = ({
  journeys,
  onSelectJourney,
}) => {
  const renderIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        );
      case 1:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case 2:
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
    }
  };

  const getShortTitle = (id: string, fullTitle: string) => {
    switch (id) {
      case 'old-pension-letter':
        return 'Old pension letter';
      case 'address-update':
        return 'Address update';
      case 'third-party-help':
        return 'Someone helping you';
      default:
        return fullTitle.replace(/^\d+\.\s*/, '');
    }
  };

  return (
    <section
      id="journeys-section"
      className="section journeys-section-area"
      aria-labelledby="journeys-heading-title"
    >
      <div className="container">
        <div className="section-header section-center-header">
          <div className="section-number">01 / ENQUIRY GUIDES</div>
          <h2 id="journeys-heading-title" className="section-title section-main-heading">
            What do you need help <em>with?</em>
          </h2>
          <p className="section-sub section-lead-paragraph">
            What would you like help preparing for? Select your pension administration situation below to prepare questions and build your printable call plan.
          </p>
        </div>

        <div className="journey-cards-grid" role="list">
          {journeys.map((journey, index) => {
            const shortTitle = getShortTitle(journey.id, journey.cardTitle);
            return (
              <article
                key={journey.id}
                role="listitem"
                className="project-card journey-selection-card"
                onClick={() => onSelectJourney(journey.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectJourney(journey.id);
                  }
                }}
                tabIndex={0}
                aria-label={`Open preparation guide: ${shortTitle}`}
              >
                <div className="card-top-header">
                  <div className="card-icon-container" aria-hidden="true">
                    {renderIcon(index)}
                  </div>
                </div>

                <div className="project-meta">GUIDE 0{index + 1}</div>
                <h3 className="card-title-heading">{shortTitle}</h3>
                <p className="card-summary-desc">{journey.cardSummary}</p>

                <div className="card-bottom-action">
                  <div className="btn-card-link">
                    <span>Prepare this enquiry</span>
                    <span className="btn-card-arrow-circle" aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
