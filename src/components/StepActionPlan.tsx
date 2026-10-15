import React from 'react';
import { ChecklistItem, JourneyData } from '../types';

interface StepActionPlanProps {
  journey: JourneyData;
  situationAnswers: Record<string, string>;
  fullChecklist: ChecklistItem[];
  checkedItems: Record<string, boolean>;
  selectedQuestionIds: Record<string, boolean>;
  userNotes: string;
  onNotesChange: (notes: string) => void;
  onPrint: () => void;
  onStartAgain: () => void;
  onBackToStep2: () => void;
}

export const StepActionPlan: React.FC<StepActionPlanProps> = ({
  journey,
  situationAnswers,
  fullChecklist,
  checkedItems,
  selectedQuestionIds,
  userNotes,
  onNotesChange,
  onPrint,
  onStartAgain,
  onBackToStep2,
}) => {
  const completedChecklist = fullChecklist.filter((item) => !!checkedItems[item.id]);
  const pendingChecklist = fullChecklist.filter((item) => !checkedItems[item.id]);
  const selectedQuestions = journey.suggestedQuestions.filter((q) => !!selectedQuestionIds[q.id]);
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPdf = () => {
    const streamContent: string[] = [];
    streamContent.push('BT');
    streamContent.push('/F2 16 Tf');
    streamContent.push('50 780 Td');
    streamContent.push('(PensionSteps - Call Plan) Tj');
    streamContent.push('ET');

    streamContent.push('BT');
    streamContent.push('/F1 10 Tf');
    streamContent.push('50 762 Td');
    streamContent.push(`(Enquiry: ${journey.cardTitle.replace(/[\(\)]/g, '')} | Date: ${currentDate}) Tj`);
    streamContent.push('ET');

    streamContent.push('0.5 w');
    streamContent.push('50 750 m');
    streamContent.push('545 750 l');
    streamContent.push('S');

    const sections = [
      {
        heading: '1. Checklist Items Completed',
        lines: completedChecklist.length > 0 
          ? completedChecklist.map(c => `[x] ${c.label}`)
          : ['(None marked as done yet)']
      },
      {
        heading: '2. Pending Checklist Items to Gather',
        lines: pendingChecklist.length > 0
          ? pendingChecklist.map(c => `[ ] ${c.label}`)
          : ['(All items completed)']
      },
      {
        heading: '3. Questions to Ask Provider',
        lines: selectedQuestions.length > 0
          ? selectedQuestions.map((q, i) => `${i + 1}. ${q.question}`)
          : ['(No specific questions selected)']
      },
      {
        heading: '4. Provider Boundaries',
        lines: journey.providerOnlyItems.map(b => `- ${b.title}: ${b.detail}`)
      },
      {
        heading: '5. Call Notes & Reference Log',
        lines: [
          'Adviser Name: _______________________  Date & Time: _______________________',
          'Call Reference Number: __________________________________________________',
          userNotes ? `Custom Notes: ${userNotes}` : 'Custom Notes: (Leave blank or write notes during call)'
        ]
      }
    ];

    let currentY = 725;
    for (const sec of sections) {
      streamContent.push('BT');
      streamContent.push('/F2 11 Tf');
      streamContent.push(`50 ${currentY} Td`);
      streamContent.push(`(${sec.heading.replace(/[\(\)]/g, '')}) Tj`);
      streamContent.push('ET');
      currentY -= 16;

      streamContent.push('BT');
      streamContent.push('/F1 9 Tf');
      streamContent.push(`50 ${currentY} Td`);
      for (const line of sec.lines) {
        streamContent.push(`(${line.replace(/[\(\)]/g, '')}) Tj`);
        streamContent.push('0 -13 Td');
        currentY -= 13;
      }
      streamContent.push('ET');
      currentY -= 10;
    }

    // Footer
    streamContent.push('0.5 w');
    streamContent.push('50 55 m');
    streamContent.push('545 55 l');
    streamContent.push('S');
    streamContent.push('BT');
    streamContent.push('/F1 8 Tf');
    streamContent.push('50 42 Td');
    streamContent.push('(PensionSteps - Independent UK Pension Enquiry Preparation - No Personal Data Stored) Tj');
    streamContent.push('ET');

    const streamText = streamContent.join('\n');
    const streamLen = new TextEncoder().encode(streamText).length;

    const body = [
      '%PDF-1.4',
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      `6 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamText}\nendstream\nendobj`
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
    a.download = `PensionSteps_Call_Plan_${journey.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="call-plan-layout-box">
      {/* Print-only Banner */}
      <div className="call-plan-print-banner" aria-hidden="true">
        <h1>PensionSteps — Call Plan</h1>
        <p>Date prepared: {currentDate} | Enquiry: {journey.cardTitle}</p>
        <p>Independent pension-enquiry preparation plan. Not financial advice.</p>
      </div>

      <header className="call-plan-head-strip">
        <div className="step-counter-pill">Step 3 of 3</div>
        <h3 className="call-plan-main-title">Your Call Plan</h3>
        <p className="call-plan-lead-desc">
          Keep this plan beside you during your call or use it when composing a written enquiry to your pension provider.
        </p>

        <div className="call-plan-meta-strip no-print">
          <div className="call-plan-meta-pill">
            <strong>Checklist:</strong> {completedChecklist.length} checked ({pendingChecklist.length} to locate)
          </div>
          <div className="call-plan-meta-pill">
            <strong>Questions queued:</strong> {selectedQuestions.length} selected
          </div>
          <div className="call-plan-meta-pill">
            <strong>Privacy:</strong> In-memory only (never stored)
          </div>
        </div>
      </header>

      {/* Situation Summary */}
      <section className="plan-section" aria-labelledby="cp-situation-title">
        <h4 id="cp-situation-title" className="plan-section-title">
          1. Your Situation Summary
        </h4>
        <div className="situation-summary-grid">
          {journey.situationQuestions.map((q) => {
            const chosenValue = situationAnswers[q.id];
            const chosenOption = q.options.find((opt) => opt.value === chosenValue);
            return (
              <div key={q.id} className="situation-summary-item">
                <span className="situation-summary-label">{q.prompt}</span>
                <span className="situation-summary-value">
                  {chosenOption ? chosenOption.label : 'Not specified'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checklist Status */}
      <section className="plan-section" aria-labelledby="cp-checklist-title">
        <h4 id="cp-checklist-title" className="plan-section-title">
          2. Preparation Checklist Status
        </h4>

        <table className="call-plan-status-table" aria-label="Checklist status items">
          <tbody>
            {completedChecklist.map((item) => (
              <tr key={item.id} className="row-completed">
                <td className="status-icon-td" aria-hidden="true">&#10003;</td>
                <td>
                  <strong>{item.label}</strong>
                  <div className="item-sub-status">Ready / Located</div>
                </td>
              </tr>
            ))}
            {pendingChecklist.map((item) => (
              <tr key={item.id} className="row-pending">
                <td className="status-icon-td text-muted" aria-hidden="true">&#9675;</td>
                <td>
                  <strong>{item.label}</strong>
                  <div className="item-sub-status">To check or locate before calling</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Questions to Ask */}
      <section className="plan-section" aria-labelledby="cp-questions-title">
        <h4 id="cp-questions-title" className="plan-section-title">
          3. Questions to Ask Your Provider
        </h4>

        <div className="questions-card-stack">
          {(selectedQuestions.length > 0 ? selectedQuestions : journey.suggestedQuestions.slice(0, 3)).map((q) => (
            <article key={q.id} className="question-card print-card">
              <span className="question-tag-chip">{q.tag}</span>
              <p className="question-quote-text">{q.question}</p>
              <p className="question-aim-text">
                <strong>Why ask:</strong> {q.context}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Provider Boundaries */}
      <section className="plan-section" aria-labelledby="cp-limits-title">
        <h4 id="cp-limits-title" className="plan-section-title">
          4. Confirmations Only Your Provider Can Provide
        </h4>
        <div className="limits-boxes-grid">
          {journey.providerOnlyItems.map((item) => (
            <div key={item.id} className="limit-item-card">
              <h5>{item.title}</h5>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call Notes & Log */}
      <section className="plan-section" aria-labelledby="cp-notes-title">
        <h4 id="cp-notes-title" className="plan-section-title">
          5. Call Reference &amp; Next Steps Log
        </h4>
        <p className="plan-section-sub">
          Record key call details while speaking with your provider.
        </p>

        <div className="call-log-fields-grid">
          <div className="call-log-field">
            <span className="call-log-label">Date of call:</span>
            <div className="call-log-line" />
          </div>
          <div className="call-log-field">
            <span className="call-log-label">Adviser / Agent name:</span>
            <div className="call-log-line" />
          </div>
          <div className="call-log-field">
            <span className="call-log-label">Reference / Case number:</span>
            <div className="call-log-line" />
          </div>
          <div className="call-log-field">
            <span className="call-log-label">Agreed follow-up date:</span>
            <div className="call-log-line" />
          </div>
        </div>

        <div className="notes-textarea-wrap no-print">
          <label htmlFor="call-notes-input" className="notes-label">
            Your call notes &amp; responses:
          </label>
          <textarea
            id="call-notes-input"
            className="call-plan-notes-textarea"
            value={userNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Spoke with Sarah. Reference number 48291. They confirmed my record is deferred and are posting an information statement to my address..."
            aria-label="Notes taken during your pension provider enquiry"
          />
          <p className="call-notes-caution">
            Note: Never write down passwords, full payment card numbers, or National Insurance numbers.
          </p>
        </div>
      </section>

      {/* Controls Bar */}
      <div className="flow-navigation-bar no-print">
        <div className="flow-nav-left">
          <button
            type="button"
            className="btn-flow-back"
            onClick={onBackToStep2}
          >
            &larr; Back to Step 2: Get ready
          </button>
          <button
            type="button"
            className="btn-flow-reset"
            onClick={onStartAgain}
          >
            Start again (clear session)
          </button>
        </div>

        <div className="flow-nav-right" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-print-action"
            style={{ backgroundColor: 'var(--color-teal)', borderColor: 'var(--color-teal)' }}
            onClick={handleDownloadPdf}
            aria-label="Download call plan as PDF"
          >
            <span aria-hidden="true">&#128190;</span> Download PDF call plan
          </button>
          <button
            type="button"
            className="btn-print-action"
            onClick={onPrint}
            aria-label="Print this call plan"
          >
            <span aria-hidden="true">&#128438;</span> Print call plan
          </button>
        </div>
      </div>
    </div>
  );
};
