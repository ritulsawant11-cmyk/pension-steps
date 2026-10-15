import React, { useState } from 'react';
import { SuggestedQuestion } from '../types';

interface StepQuestionsProps {
  questions: SuggestedQuestion[];
  selectedQuestionIds: Record<string, boolean>;
  onToggleQuestion: (id: string) => void;
}

export const StepQuestions: React.FC<StepQuestionsProps> = ({
  questions,
  selectedQuestionIds,
  onToggleQuestion,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const selectedCount = questions.filter((q) => !!selectedQuestionIds[q.id]).length;

  return (
    <section className="content-sub-block" aria-labelledby="questions-heading">
      <div className="sub-block-header">
        <div>
          <h4 id="questions-heading" className="sub-block-title">
            Suggested Questions to Ask
          </h4>
          <p className="sub-block-desc">
            Add these questions to your call plan so you can read them directly during your call or use them in written correspondence.
          </p>
        </div>
        <div className="progress-pill-badge" aria-live="polite">
          {selectedCount} of {questions.length} Selected
        </div>
      </div>

      <div className="questions-card-stack" role="group" aria-label="Suggested provider questions list">
        {questions.map((q) => {
          const isSelected = !!selectedQuestionIds[q.id];
          return (
            <article
              key={q.id}
              className={`question-card ${isSelected ? 'selected' : ''}`}
            >
              <span className="question-tag-chip">{q.tag}</span>
              <p className="question-quote-text">{q.question}</p>
              <p className="question-aim-text">
                <strong>Why ask:</strong> {q.context}
              </p>
              <div className="question-buttons-row">
                <button
                  type="button"
                  className={`btn-queue-toggle ${isSelected ? 'active' : ''}`}
                  onClick={() => onToggleQuestion(q.id)}
                  aria-pressed={isSelected}
                >
                  <span aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                  <span>{isSelected ? 'Saved to call plan' : 'Add to call plan'}</span>
                </button>
                <button
                  type="button"
                  className="btn-copy-chip"
                  onClick={() => handleCopy(q.id, q.question)}
                  aria-label={`Copy question wording: ${q.question}`}
                >
                  <span>{copiedId === q.id ? '✓ Copied' : 'Copy question'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
