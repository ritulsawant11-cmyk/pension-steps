import React from 'react';
import { SituationQuestion } from '../types';

interface StepSituationProps {
  questions: SituationQuestion[];
  answers: Record<string, string>;
  onSelectOption: (questionId: string, optionValue: string) => void;
  onNext: () => void;
  onBackToJourneys: () => void;
  onStartAgain: () => void;
}

export const StepSituation: React.FC<StepSituationProps> = ({
  questions,
  answers,
  onSelectOption,
  onNext,
  onBackToJourneys,
  onStartAgain,
}) => {
  const answeredCount = questions.filter((q) => !!answers[q.id]).length;

  return (
    <div className="content-section-panel" aria-labelledby="step1-title">
      <div className="panel-header-row">
        <div>
          <div className="step-counter-pill">Step 1 of 3</div>
          <h3 id="step1-title" className="panel-title">
            Your Situation
          </h3>
          <p className="panel-desc">
            Answer these 3 quick questions so we can tailor your preparation checklist. None of these questions ask for your name, dates, or policy numbers.
          </p>
        </div>
        <div className="progress-pill-badge" aria-live="polite">
          {answeredCount} of {questions.length} Answered
        </div>
      </div>

      <div className="situation-questions-stack">
        {questions.map((question, qIndex) => {
          const currentAnswer = answers[question.id];

          return (
            <fieldset key={question.id} className="situation-question-card">
              <legend className="situation-question-prompt">
                <span className="question-number-dot">{qIndex + 1}</span>
                <span>{question.prompt}</span>
              </legend>

              <div className="situation-options-group" role="radiogroup" aria-label={question.prompt}>
                {question.options.map((option) => {
                  const isSelected = currentAnswer === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`situation-option-card ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => onSelectOption(question.id, option.value)}
                        className="situation-radio-input"
                      />
                      <span className="option-radio-custom" aria-hidden="true">
                        {isSelected && <span className="option-radio-inner" />}
                      </span>
                      <span className="option-label-text">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="flow-navigation-bar no-print">
        <div className="flow-nav-left">
          <button
            type="button"
            className="btn-flow-back"
            onClick={onBackToJourneys}
          >
            &larr; Choose a different enquiry
          </button>
          <button
            type="button"
            className="btn-flow-reset"
            onClick={onStartAgain}
          >
            Start again
          </button>
        </div>

        <div className="flow-nav-right">
          <button
            type="button"
            className="btn-flow-next"
            onClick={onNext}
          >
            <span>Continue to Step 2: Get ready</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
