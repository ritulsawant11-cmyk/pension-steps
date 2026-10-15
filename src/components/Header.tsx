import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onStartJourney: () => void;
  onHowItWorksClick: () => void;
  onResourcesClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onHomeClick,
  onAboutClick,
  onStartJourney,
  onHowItWorksClick,
  onResourcesClick,
}) => {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={onHomeClick}
            className="brand brand-link"
            aria-label="PensionSteps Home"
          >
            <span className="brand-mark" aria-hidden="true">p</span>
            <div className="brand-title-wrap">
              <span className="brand-name">PensionSteps</span>
              <span className="brand-pill-badge">Old-Pension Enquiry Preparation</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="site-nav header-nav" aria-label="Main menu">
            <button
              type="button"
              onClick={onHowItWorksClick}
              className="nav-link"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={onAboutClick}
              className="nav-link"
              aria-haspopup="dialog"
            >
              About &amp; Safeguards
            </button>
            <button
              type="button"
              onClick={onResourcesClick}
              className="nav-link"
            >
              Official resources
            </button>
          </nav>

          {/* Header Action Button */}
          <div className="header-action-group">
            <button
              type="button"
              onClick={onStartJourney}
              className="btn btn-primary btn-sm btn-header-cta"
            >
              <span>Prepare my pension enquiry</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
