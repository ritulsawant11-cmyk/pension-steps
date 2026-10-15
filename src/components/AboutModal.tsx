import React, { useEffect, useRef } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dialog-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="about-dialog-heading" className="modal-title">
            About PensionSteps &amp; Important Safeguards
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>
            <strong>PensionSteps</strong> is an independent UK pension-enquiry preparation tool. It helps people prepare to contact a pension provider about an old pension when they have incomplete information.
          </p>

          <h4>What PensionSteps Is Not</h4>
          <p>
            PensionSteps is <strong>not</strong> a pension provider, financial adviser, account portal, or live account service. It cannot search records, locate pensions, submit requests, or update customer records with providers.
          </p>

          <h4>The Three Distinct Stages of an Old Pension Enquiry</h4>
          <p>When tracing an old pension, keep three separate concepts distinct:</p>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.6', marginBottom: '14px' }}>
            <li>
              <strong>1. Identifying an organisation:</strong> Finding the contact details of the employer or scheme administrator.
            </li>
            <li>
              <strong>2. Asking for a search:</strong> Asking that organisation to search their archived records.
            </li>
            <li>
              <strong>3. Proving identity:</strong> Completing their statutory security and identity checks before any information can be released.
            </li>
          </ol>

          <h4>Not Regulated Financial Advice</h4>
          <p>
            PensionSteps provides administrative organisation checklists and suggested conversational wording. It does not provide regulated financial advice under the UK Financial Services and Markets Act 2000.
          </p>

          <h4>Requirements Vary</h4>
          <p>
            All UK pension schemes operate under distinct trust deeds, scheme rules, and administrator procedures. Requirements must always be checked directly with your scheme administrator.
          </p>

          <h4>Zero Personal Data Collection</h4>
          <p>
            This website does not collect or store personal identifiers, National Insurance numbers, policy numbers, or addresses. All selections remain in your browser’s temporary memory during your current visit and are cleared when you reset or start again.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
