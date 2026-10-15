import React from 'react';
import {
  STEP1_KNOWLEDGE_OPTIONS,
  STEP2_CHECKLIST_ITEMS,
  STEP3_GUIDANCE_BRANCHES,
  isEmployerKnown,
  isProviderKnown,
  isPolicyNumberKnown,
  syncReadinessWithKnown,
  syncKnownWithReadiness,
} from '../data/oldPensionData';
import { OldPensionJourneyState, ReadinessStatus } from '../types';

interface GuidedJourneyFlowProps {
  state: OldPensionJourneyState;
  onUpdateState: (updates: Partial<OldPensionJourneyState>) => void;
  onHomeClick: () => void;
  onStartAgain: () => void;
}

export const GuidedJourneyFlow: React.FC<GuidedJourneyFlowProps> = ({
  state,
  onUpdateState,
  onHomeClick,
  onStartAgain,
}) => {
  const currentStep = state.activeStep;

  // Compute active guidance branches
  const activeBranches = STEP3_GUIDANCE_BRANCHES.filter((branch) =>
    branch.isActive(state.knownDetails, state.readinessStatus)
  );

  // Stepper labels
  const stepsMeta = [
    { num: 1, title: 'What you know', sub: 'Step 1 of 4' },
    { num: 2, title: 'Have ready', sub: 'Step 2 of 4' },
    { num: 3, title: 'Guidance', sub: 'Step 3 of 4' },
    { num: 4, title: 'Enquiry plan', sub: 'Step 4 of 4' },
  ];

  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep) {
      onUpdateState({ activeStep: targetStep });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 1: toggle knowledge option
  const handleToggleKnowledge = (id: string, isExclusive?: boolean) => {
    let nextKnown = [...state.knownDetails];
    if (isExclusive) {
      if (nextKnown.includes(id)) {
        nextKnown = [];
      } else {
        nextKnown = [id];
      }
    } else {
      nextKnown = nextKnown.filter((k) => k !== 'very_little');
      if (nextKnown.includes(id)) {
        nextKnown = nextKnown.filter((k) => k !== id);
      } else {
        nextKnown.push(id);
      }
    }
    const nextReadiness = syncReadinessWithKnown(nextKnown, state.readinessStatus);
    onUpdateState({
      knownDetails: nextKnown,
      readinessStatus: nextReadiness,
    });
  };

  // Step 2: set status
  const handleSetStatus = (itemId: string, status: ReadinessStatus) => {
    const nextKnown = syncKnownWithReadiness(itemId, status, state.knownDetails);
    onUpdateState({
      knownDetails: nextKnown,
      readinessStatus: {
        ...state.readinessStatus,
        [itemId]: status,
      },
    });
  };

  // Step 3: toggle question
  const handleToggleQuestion = (qText: string) => {
    const current = state.selectedQuestionIds[qText] !== false;
    onUpdateState({
      selectedQuestionIds: {
        ...state.selectedQuestionIds,
        [qText]: !current,
      },
    });
  };

  // Step 4 questions to display
  const allSuggestedQuestions: string[] = [];
  activeBranches.forEach((b) => {
    b.suggestedQuestions.forEach((q) => {
      if (!allSuggestedQuestions.includes(q)) {
        allSuggestedQuestions.push(q);
      }
    });
  });

  const selectedQuestions = allSuggestedQuestions.filter(
    (q) => state.selectedQuestionIds[q] !== false
  );

  // Client-side PDF generation
  const handleDownloadPdf = () => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const escapePdfText = (txt: string) => {
      return (txt || '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/[^\x20-\x7E]/g, ' ');
    };

    const lines: string[] = [];
    lines.push('BT');
    lines.push('/F1 16 Tf');
    lines.push('50 780 Td');
    lines.push(`(${escapePdfText('PensionSteps — Old-Pension Enquiry Preparation Plan')}) Tj`);

    lines.push('/F2 9 Tf');
    lines.push('0 -14 Td');
    lines.push(
      `(${escapePdfText(`Date Prepared: ${currentDate} | Independent Preparation Tool (Not Financial Advice)`)}) Tj`
    );

    lines.push('0 -22 Td');
    lines.push('/F1 11 Tf');
    lines.push(`(${escapePdfText('1. SITUATION SUMMARY')}) Tj`);
    lines.push('/F2 9 Tf');

    const knownTitles =
      state.knownDetails.length > 0
        ? state.knownDetails.map((id) => {
            const item = STEP1_KNOWLEDGE_OPTIONS.find((o) => o.id === id);
            return item ? item.title : id;
          })
        : ['Very little — starting from scratch'];

    lines.push('0 -13 Td');
    lines.push(`(${escapePdfText(`What is currently known: ${knownTitles.join('; ')}`)}) Tj`);

    const employerStatus =
      isProviderKnown(state.knownDetails, state.readinessStatus) &&
      isEmployerKnown(state.knownDetails, state.readinessStatus)
        ? 'Both employer & provider known'
        : isProviderKnown(state.knownDetails, state.readinessStatus)
        ? 'Provider known (employer unconfirmed)'
        : isEmployerKnown(state.knownDetails, state.readinessStatus)
        ? 'Employer known (provider/scheme to be traced)'
        : 'Both employer & provider unknown (career timeline trace)';

    const policyStatus = isPolicyNumberKnown(state.knownDetails, state.readinessStatus)
      ? 'Policy reference available'
      : 'Policy reference missing';

    lines.push('0 -11 Td');
    lines.push(`(${escapePdfText(`Status assessment: ${employerStatus} | ${policyStatus}`)}) Tj`);

    lines.push('0 -18 Td');
    lines.push('/F1 11 Tf');
    lines.push(`(${escapePdfText('2. INFORMATION TO HAVE READY ON YOUR DESK')}) Tj`);
    lines.push('/F2 9 Tf');

    STEP2_CHECKLIST_ITEMS.forEach((item) => {
      const status = state.readinessStatus[item.id] || 'unsure';
      const tag = status === 'have' ? '[READY]' : status === 'look' ? '[TO LOOK FOR]' : '[UNSURE]';
      lines.push('0 -13 Td');
      lines.push(`(${escapePdfText(`${tag} ${item.title}`)}) Tj`);
    });

    lines.push('0 -18 Td');
    lines.push('/F1 11 Tf');
    lines.push(`(${escapePdfText('3. RECOMMENDED QUESTIONS TO ASK')}) Tj`);
    lines.push('/F2 9 Tf');

    if (selectedQuestions.length > 0) {
      selectedQuestions.slice(0, 5).forEach((q, idx) => {
        lines.push('0 -13 Td');
        lines.push(`(${escapePdfText(`${idx + 1}. ${q}`)}) Tj`);
      });
    } else {
      lines.push('0 -13 Td');
      lines.push(`(${escapePdfText('(No specific questions selected - use the space below to note your enquiry points)')}) Tj`);
    }

    lines.push('0 -22 Td');
    lines.push('/F1 11 Tf');
    lines.push(`(${escapePdfText('4. CONVERSATION RECORD & NEXT ACTIONS')}) Tj`);
    lines.push('/F2 9 Tf');
    lines.push('0 -14 Td');
    lines.push(`(${escapePdfText('Date Contacted: ____________________  Organisation/Team: __________________________')}) Tj`);
    lines.push('0 -14 Td');
    lines.push(`(${escapePdfText('Enquiry Reference: _________________  Agreed Follow-up Date: ______________________')}) Tj`);
    lines.push('0 -14 Td');
    lines.push(`(${escapePdfText('What they told you:')}) Tj`);
    lines.push('0 -13 Td');
    lines.push(`(${escapePdfText('__________________________________________________________________________________')}) Tj`);
    lines.push('0 -13 Td');
    lines.push(`(${escapePdfText('__________________________________________________________________________________')}) Tj`);
    lines.push('0 -14 Td');
    lines.push(`(${escapePdfText('Agreed next action:')}) Tj`);
    lines.push('0 -13 Td');
    lines.push(`(${escapePdfText('__________________________________________________________________________________')}) Tj`);

    lines.push('0 -20 Td');
    lines.push('/F2 8 Tf');
    lines.push(`(${escapePdfText('Requirements vary. The organisation contacted will explain what verification it needs.')}) Tj`);
    lines.push('0 -10 Td');
    lines.push(`(${escapePdfText('PensionSteps is an independent preparation tool. It does not search for pensions or access records.')}) Tj`);
    lines.push('ET');

    const streamContent = lines.join('\n');
    const streamLength = new TextEncoder().encode(streamContent).length;

    const body = [
      '%PDF-1.4',
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj',
      `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`,
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    ];

    const offsets: number[] = [];
    let rawPdf = '';
    for (const obj of body) {
      offsets.push(new TextEncoder().encode(rawPdf).length);
      rawPdf += obj + '\n';
    }

    const xrefOffset = new TextEncoder().encode(rawPdf).length;
    rawPdf += 'xref\n0 7\n0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i++) {
      rawPdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    rawPdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([rawPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PensionSteps_Old_Pension_Plan.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="journey-page-wrapper">
      <div className="container journey-focused-container">
        {/* Stepper Bar */}
        <div
          className="journey-stepper-bar no-print"
          role="navigation"
          aria-label="Enquiry preparation progress"
        >
          {stepsMeta.map((sm) => {
            const isActive = sm.num === currentStep;
            const isCompleted = sm.num < currentStep;
            return (
              <button
                key={sm.num}
                type="button"
                className={`step-tab-button ${isActive ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                }`}
                onClick={() => handleStepClick(sm.num)}
                disabled={sm.num > currentStep}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="step-badge-number">
                  {isCompleted ? '✓' : sm.num}
                </span>
                <span className="step-tab-labels">
                  <span className="step-sublabel">{sm.sub}</span>
                  <span className="step-mainlabel">{sm.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: WHAT DO YOU KNOW? */}
        {currentStep === 1 && (
          <div className="content-section-panel">
            <div className="section-number">STEP 1 OF 4 — WHAT DO YOU KNOW?</div>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              What do you still have or remember?
            </h2>
            <p className="section-sub" style={{ marginBottom: '20px' }}>
              Select all that apply. It’s okay if you don’t remember everything. Start with what you know, and we will tailor the next steps.
            </p>
            <div className="security-notice-callout">
              <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
                ℹ️
              </span>
              <div>
                <strong>Start with what you know: </strong>
                Pension administrators understand that records from 15–25 years ago often have missing details. You can continue with incomplete information. Do not enter actual personal identifiers or numbers on this website.
              </div>
            </div>

            <div
              className="knowledge-options-group"
              role="group"
              aria-label="Information you currently have or remember"
            >
              {STEP1_KNOWLEDGE_OPTIONS.map((opt) => {
                const isSelected = state.knownDetails.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`knowledge-option-card ${
                      isSelected ? 'selected' : ''
                    } ${opt.isExclusive ? 'knowledge-option-exclusive' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleKnowledge(opt.id, opt.isExclusive);
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleToggleKnowledge(opt.id, opt.isExclusive);
                      }
                    }}
                  >
                    <span className="chk-box-custom" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                    <div style={{ flex: 1, pointerEvents: 'none' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--ink)',
                          fontSize: '0.98rem',
                        }}
                      >
                        {opt.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--muted)',
                          marginTop: '2px',
                        }}
                      >
                        {opt.hint}
                      </div>
                    </div>
                    <span aria-hidden="true" style={{ fontSize: '1.2rem', pointerEvents: 'none' }}>
                      {opt.icon}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flow-navigation-bar">
              <div className="flow-nav-left">
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={onHomeClick}
                >
                  &larr; Return to overview
                </button>
              </div>
              <div className="flow-nav-right">
                <button
                  type="button"
                  className="btn-flow-next"
                  onClick={() => {
                    if (!state.knownDetails || state.knownDetails.length === 0) {
                      const nextKnown = ['very_little'];
                      onUpdateState({
                        knownDetails: nextKnown,
                        readinessStatus: syncReadinessWithKnown(nextKnown, state.readinessStatus),
                        activeStep: 2,
                      });
                    } else {
                      onUpdateState({
                        readinessStatus: syncReadinessWithKnown(state.knownDetails, state.readinessStatus),
                        activeStep: 2,
                      });
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>
                    {!state.knownDetails || state.knownDetails.length === 0
                      ? 'Continue (start with what I have)'
                      : 'Continue to Step 2'}
                  </span>
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: WHAT INFORMATION CAN YOU HAVE READY? */}
        {currentStep === 2 && (
          <div className="content-section-panel">
            <div className="section-number">STEP 2 OF 4 — WHAT TO HAVE READY</div>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              Review what information you can have ready
            </h2>
            <p className="section-sub" style={{ marginBottom: '16px' }}>
              For each item, indicate whether you have it ready on paper, need to look for it, or are unsure. We adapt your checklist accordingly.
            </p>
            <div className="security-notice-callout">
              <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
                🔒
              </span>
              <div>
                <strong>
                  Have sensitive information ready for the provider, but do not enter it on PensionSteps.
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem' }}>
                  No fields are provided for entering actual policy numbers, NI numbers, or full addresses. None of these items are mandatory. A National Insurance number may help with a search depending on the provider, but does not guarantee a policy will be found or replace identity verification.
                </p>
              </div>
            </div>

            <div className="checklist-stack">
              {STEP2_CHECKLIST_ITEMS.map((item) => {
                const currentStatus = state.readinessStatus[item.id] || 'unsure';
                return (
                  <div key={item.id} className="status-selection-card">
                    <div className="status-card-header">
                      <h3 className="status-card-title">{item.title}</h3>
                      <p className="status-card-desc">{item.description}</p>
                      {item.hint && (
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--muted)',
                            margin: '4px 0 0',
                            fontStyle: 'italic',
                          }}
                        >
                          {item.hint}
                        </p>
                      )}
                      {item.securityNote && (
                        <span className="status-security-note">
                          Notice: {item.securityNote}
                        </span>
                      )}
                    </div>
                    <div
                      className="status-pill-group"
                      role="radiogroup"
                      aria-label={`Status for ${item.title}`}
                    >
                      <button
                        type="button"
                        className={`status-pill-btn ${
                          currentStatus === 'have' ? 'active' : ''
                        }`}
                        data-status="have"
                        onClick={() => handleSetStatus(item.id, 'have')}
                        role="radio"
                        aria-checked={currentStatus === 'have'}
                      >
                        ✓ I have this
                      </button>
                      <button
                        type="button"
                        className={`status-pill-btn ${
                          currentStatus === 'look' ? 'active' : ''
                        }`}
                        data-status="look"
                        onClick={() => handleSetStatus(item.id, 'look')}
                        role="radio"
                        aria-checked={currentStatus === 'look'}
                      >
                        🔍 I need to look for it
                      </button>
                      <button
                        type="button"
                        className={`status-pill-btn ${
                          currentStatus === 'unsure' ? 'active' : ''
                        }`}
                        data-status="unsure"
                        onClick={() => handleSetStatus(item.id, 'unsure')}
                        role="radio"
                        aria-checked={currentStatus === 'unsure'}
                      >
                        ? I’m not sure
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flow-navigation-bar">
              <div className="flow-nav-left">
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={() => {
                    onUpdateState({ activeStep: 1 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  &larr; Back to Step 1
                </button>
              </div>
              <div className="flow-nav-right">
                <button
                  type="button"
                  className="btn-flow-next"
                  onClick={() => {
                    onUpdateState({ activeStep: 3 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Continue to Guidance</span>
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: GUIDANCE FOR YOUR SITUATION */}
        {currentStep === 3 && (
          <div className="content-section-panel">
            <div className="section-number">
              STEP 3 OF 4 — GUIDANCE FOR YOUR SITUATION
            </div>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              Tailored guidance for what you know
            </h2>
            <p className="section-sub" style={{ marginBottom: '24px' }}>
              Based on your selections, here are the most relevant investigation steps, official resources, and suggested questions to ask.
            </p>

            <div className="guidance-stack">
              {activeBranches.map((branch) => {
                return (
                  <div key={branch.id} className="guidance-branch-card">
                    <span className="branch-badge">{branch.badge}</span>
                    <h3>{branch.title}</h3>
                    <p>{branch.summary}</p>
                    <ul
                      style={{
                        margin: '0 0 16px 20px',
                        padding: 0,
                        fontSize: '0.9rem',
                        color: 'var(--ink)',
                        lineHeight: '1.6',
                      }}
                    >
                      {branch.keyPoints.map((kp, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>
                          {kp}
                        </li>
                      ))}
                    </ul>

                    {branch.officialLink && (
                      <div className="guidance-action-link-box">
                        <p
                          style={{
                            margin: '0 0 6px',
                            fontSize: '0.85rem',
                            color: 'var(--muted)',
                          }}
                        >
                          {branch.officialLink.description}
                        </p>
                        <a
                          href={branch.officialLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {branch.officialLink.label}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: '16px',
                        borderTop: '1px solid var(--line)',
                        paddingTop: '14px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: '8px',
                        }}
                      >
                        Suggested questions for this situation (included in your plan):
                      </h4>
                      {branch.suggestedQuestions.map((q, idx) => {
                        const isChecked = state.selectedQuestionIds[q] !== false;
                        return (
                          <label
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              padding: '8px 12px',
                              background: isChecked
                                ? 'var(--paper)'
                                : 'transparent',
                              border: '1px solid var(--line)',
                              borderRadius: 'var(--radius-xs)',
                              marginBottom: '6px',
                              cursor: 'pointer',
                              fontSize: '0.88rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleQuestion(q)}
                              style={{ marginTop: '3px' }}
                            />
                            <span
                              style={{
                                color: 'var(--ink)',
                                fontWeight: isChecked ? 600 : 400,
                              }}
                            >
                              {q}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flow-navigation-bar">
              <div className="flow-nav-left">
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={() => {
                    onUpdateState({ activeStep: 2 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  &larr; Back to Step 2
                </button>
              </div>
              <div className="flow-nav-right">
                <button
                  type="button"
                  className="btn-flow-next"
                  onClick={() => {
                    onUpdateState({ activeStep: 4 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Generate my enquiry plan</span>
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW AND PRINT (ENQUIRY PLAN) */}
        {currentStep === 4 && (
          <div className="call-plan-layout-box">
            {/* Print-only Header */}
            <div className="call-plan-print-banner" aria-hidden="true">
              <h1>PensionSteps — Old-Pension Enquiry Preparation Plan</h1>
              <p>
                Prepared on:{' '}
                {new Date().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                | Independent Enquiry Worksheet
              </p>
              <p>
                Independent preparation tool. Does not search databases or provide financial advice.
              </p>
            </div>

            {/* Screen Header */}
            <header className="call-plan-head-strip">
              <div className="section-number">
                STEP 4 OF 4 — YOUR ENQUIRY PLAN
              </div>
              <h2 className="call-plan-main-title">
                Your Personalised Enquiry Plan
              </h2>
              <p className="call-plan-lead-desc">
                Keep this plan beside you during your call, or use it when composing an email or postal enquiry to the scheme administrator.
              </p>
              <div className="call-plan-meta-strip no-print">
                <div className="call-plan-meta-pill">
                  <strong>Checklist items: </strong>
                  {STEP2_CHECKLIST_ITEMS.length} organised
                </div>
                <div className="call-plan-meta-pill">
                  <strong>Questions queued: </strong>
                  {selectedQuestions.length} selected
                </div>
                <div className="call-plan-meta-pill">
                  <strong>Privacy: </strong>
                  In-memory browser session only
                </div>
              </div>
            </header>

            {/* 1. Situation Summary */}
            <section className="plan-section">
              <h3 className="plan-section-title">1. Your Situation Summary</h3>
              <div className="situation-summary-list">
                <div className="situation-summary-item">
                  <span className="situation-summary-label">
                    Starting knowledge:
                  </span>
                  <span className="situation-summary-value">
                    {state.knownDetails.length > 0
                      ? state.knownDetails
                          .map((id) => {
                            const opt = STEP1_KNOWLEDGE_OPTIONS.find(
                              (o) => o.id === id
                            );
                            return opt ? opt.title : id;
                          })
                          .join(' • ')
                      : 'Starting with very little (investigative route)'}
                  </span>
                </div>
                <div className="situation-summary-item">
                  <span className="situation-summary-label">
                    Policy reference:
                  </span>
                  <span className="situation-summary-value">
                    {isPolicyNumberKnown(state.knownDetails, state.readinessStatus)
                      ? 'Available on paper'
                      : 'Missing (to be requested via personal details)'}
                  </span>
                </div>
                <div className="situation-summary-item">
                  <span className="situation-summary-label">
                    Former employer / provider:
                  </span>
                  <span className="situation-summary-value">
                    {isProviderKnown(state.knownDetails, state.readinessStatus) &&
                    isEmployerKnown(state.knownDetails, state.readinessStatus)
                      ? 'Both known (Direct Provider contact with employer context)'
                      : isProviderKnown(state.knownDetails, state.readinessStatus)
                      ? 'Provider known (employer unconfirmed)'
                      : isEmployerKnown(state.knownDetails, state.readinessStatus)
                      ? 'Employer known (provider or scheme administrator to be traced)'
                      : 'Both unknown (career timeline trace & HMRC employment history)'}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Information to have ready */}
            <section className="plan-section">
              <h3 className="plan-section-title">2. Information to have ready</h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--muted)',
                  marginBottom: '12px',
                }}
              >
                Requirements vary. The organisation you contact will explain what information and verification it needs.
              </p>
              <table className="call-plan-status-table">
                <tbody>
                  {STEP2_CHECKLIST_ITEMS.map((item) => {
                    const status = state.readinessStatus[item.id] || 'unsure';
                    const label =
                      status === 'have'
                        ? 'I have this'
                        : status === 'look'
                        ? 'I need to look for it'
                        : 'I’m not sure';
                    const badgeStyle =
                      status === 'have'
                        ? { color: 'var(--teal)', fontWeight: 'bold' }
                        : status === 'look'
                        ? { color: '#92400E', fontWeight: 'bold' }
                        : { color: 'var(--muted)' };
                    return (
                      <tr key={item.id}>
                        <td style={{ width: '130px', ...badgeStyle }}>{label}</td>
                        <td>
                          <div
                            style={{ fontWeight: 600, color: 'var(--ink)' }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--muted)',
                            }}
                          >
                            {item.description}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* 3. Who you could contact next */}
            <section className="plan-section">
              <h3 className="plan-section-title">3. Who to contact next</h3>
              <div
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {isProviderKnown(state.knownDetails, state.readinessStatus) &&
                isEmployerKnown(state.knownDetails, state.readinessStatus) ? (
                  <div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: 'var(--ink)',
                        margin: '0 0 6px',
                      }}
                    >
                      Direct Scheme Provider / Administrator (with Employer Context)
                    </h4>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: 0,
                      }}
                    >
                      Contact the customer servicing department of the named pension provider. Provide your former employer name and employment dates to assist their search in matching you to the right historical group scheme.
                    </p>
                  </div>
                ) : isProviderKnown(state.knownDetails, state.readinessStatus) ? (
                  <div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: 'var(--ink)',
                        margin: '0 0 6px',
                      }}
                    >
                      Direct Scheme Provider / Administrator
                    </h4>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: 0,
                      }}
                    >
                      Contact the customer servicing department of the named pension provider. Ask for their historic policy search or trace team to look up your record using personal details.
                    </p>
                  </div>
                ) : isEmployerKnown(state.knownDetails, state.readinessStatus) ? (
                  <div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: 'var(--ink)',
                        margin: '0 0 6px',
                      }}
                    >
                      Former Employer HR or Pension Tracing Service
                    </h4>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: '0 0 8px',
                      }}
                    >
                      1. If your former employer is still in business, contact their HR or pensions team for scheme administrator details.
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: 0,
                      }}
                    >
                      2. If the company closed or merged, use the government’s free statutory database:{' '}
                      <a
                        href="https://www.gov.uk/find-pension-contact-details"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        gov.uk/find-pension-contact-details
                      </a>
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: 'var(--ink)',
                        margin: '0 0 6px',
                      }}
                    >
                      Checking Past Employment Records &amp; Free Tracing Guidance
                    </h4>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: '0 0 8px',
                      }}
                    >
                      Reconstruct your employment timeline: check old P45/P60 certificates, payslips, or your online HMRC Personal Tax Account employment history.
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        margin: 0,
                      }}
                    >
                      Review free independent tracing guidance at{' '}
                      <a
                        href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        moneyhelper.org.uk/tracing-and-finding-lost-pensions
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 4. Questions to ask */}
            <section className="plan-section">
              <h3 className="plan-section-title">4. Questions to ask on your call</h3>
              <div className="questions-card-stack">
                {selectedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="question-card selected"
                    style={{ cursor: 'default' }}
                  >
                    <div className="question-quote-text">
                      {idx + 1}. &ldquo;{q}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Blank spaces to record conversation */}
            <section className="plan-section">
              <h3 className="plan-section-title">
                5. Conversation Record &amp; Next Actions
              </h3>
              <div className="worksheet-log-block">
                <div className="call-log-fields-grid">
                  <div className="call-log-field">
                    <span className="call-log-label">Date of contact</span>
                    <div className="worksheet-write-line" />
                  </div>
                  <div className="call-log-field">
                    <span className="call-log-label">
                      Organisation or team contacted
                    </span>
                    <div className="worksheet-write-line" />
                  </div>
                  <div className="call-log-field">
                    <span className="call-log-label">Enquiry reference given</span>
                    <div className="worksheet-write-line" />
                  </div>
                </div>
                <div className="worksheet-write-row">
                  <span className="worksheet-write-label">What they told you:</span>
                  <div className="worksheet-write-box" />
                </div>
                <div className="worksheet-write-row">
                  <span className="worksheet-write-label">
                    Agreed next action &amp; follow-up date:
                  </span>
                  <div
                    className="worksheet-write-box"
                    style={{ minHeight: '50px' }}
                  />
                </div>
              </div>
            </section>

            {/* Service Boundaries Reminder */}
            <div
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.84rem',
                color: 'var(--muted)',
                marginBottom: '24px',
              }}
            >
              <strong>Important Reminder: </strong>
              Requirements vary. The organisation you contact will explain what information and verification it needs. PensionSteps is an independent preparation tool. It does not provide financial advice, access pension accounts or submit requests to providers.
            </div>

            {/* Action buttons */}
            <div className="flow-navigation-bar no-print">
              <div className="flow-nav-left">
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={() => {
                    onUpdateState({ activeStep: 3 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  &larr; Back to Step 3
                </button>
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={() => {
                    onUpdateState({ activeStep: 1 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  ✎ Edit answers
                </button>
              </div>
              <div className="flow-nav-right">
                <button
                  type="button"
                  className="btn-flow-reset"
                  onClick={onStartAgain}
                >
                  ↺ Start again
                </button>
                <button
                  type="button"
                  className="btn-print-action"
                  onClick={() => window.print()}
                >
                  ⎙ Print my plan
                </button>
                <button
                  type="button"
                  className="btn-print-action"
                  style={{
                    backgroundColor: 'var(--ink)',
                    borderColor: 'var(--ink)',
                  }}
                  onClick={handleDownloadPdf}
                >
                  📥 Download PDF plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
