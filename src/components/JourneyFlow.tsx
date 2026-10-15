import React, { useMemo } from 'react';
import { ChecklistItem, JourneyData, JourneyState } from '../types';
import { StepSituation } from './StepSituation';
import { StepChecklist } from './StepChecklist';
import { StepQuestions } from './StepQuestions';
import { StepProviderLimits } from './StepProviderLimits';
import { StepActionPlan } from './StepActionPlan';

interface JourneyFlowProps {
  journey: JourneyData;
  state: JourneyState;
  onUpdateState: (updates: Partial<JourneyState>) => void;
  onHomeClick: () => void;
  onStartAgain: () => void;
}

export const JourneyFlow: React.FC<JourneyFlowProps> = ({
  journey,
  state,
  onUpdateState,
  onHomeClick,
  onStartAgain,
}) => {
  const { activeStep, situationAnswers, checkedItems, selectedQuestionIds, userNotes } = state;

  // Build the tailored checklist based on baseline items + user's situation answers
  const fullChecklist = useMemo<ChecklistItem[]>(() => {
    const list: ChecklistItem[] = [...journey.baselineChecklist];

    journey.situationQuestions.forEach((q) => {
      const selectedValue = situationAnswers[q.id];
      if (selectedValue) {
        const option = q.options.find((opt) => opt.value === selectedValue);
        if (option && option.tailoredChecklistItems) {
          option.tailoredChecklistItems.forEach((item) => {
            if (!list.some((existing) => existing.id === item.id)) {
              list.push(item);
            }
          });
        }
      }
    });

    return list;
  }, [journey, situationAnswers]);

  const handleSelectSituationOption = (questionId: string, optionValue: string) => {
    onUpdateState({
      situationAnswers: {
        ...situationAnswers,
        [questionId]: optionValue,
      },
    });
  };

  const handleToggleChecklist = (id: string) => {
    onUpdateState({
      checkedItems: {
        ...checkedItems,
        [id]: !checkedItems[id],
      },
    });
  };

  const handleToggleQuestion = (id: string) => {
    onUpdateState({
      selectedQuestionIds: {
        ...selectedQuestionIds,
        [id]: !selectedQuestionIds[id],
      },
    });
  };

  const handleNotesChange = (notes: string) => {
    onUpdateState({ userNotes: notes });
  };

  const handlePrint = () => {
    window.print();
  };

  const goToStep = (stepNumber: number) => {
    onUpdateState({ activeStep: stepNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="journey-page-wrapper">
      <div className="container journey-focused-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav-bar no-print" aria-label="Breadcrumb navigation">
          <button
            type="button"
            className="btn-breadcrumb-crumb"
            onClick={onHomeClick}
          >
            All Guidance Journeys
          </button>
          <span aria-hidden="true">&rsaquo;</span>
          <span>{journey.cardTitle}</span>
        </nav>

        {/* Top Journey Overview Card */}
        <header className="journey-top-card">
          <h2 className="journey-heading-title">{journey.cardTitle}</h2>
          <p className="journey-tagline-text">{journey.tagline}</p>
          <p className="journey-overview-desc">{journey.overview}</p>
          <div className="journey-regulatory-notice" role="note">
            <span aria-hidden="true">⚠️</span>
            <span>{journey.regulatoryNotice}</span>
          </div>
        </header>

        {/* 3-Stage Progress Stepper Bar */}
        <nav className="journey-stepper-bar no-print" aria-label="Journey progress steps">
          <button
            type="button"
            className={`step-tab-button ${activeStep === 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}
            onClick={() => goToStep(1)}
            aria-current={activeStep === 1 ? 'step' : undefined}
          >
            <span className="step-badge-number">1</span>
            <span className="step-tab-labels">
              <span className="step-sublabel">Step 1 of 3</span>
              <span className="step-mainlabel">Your Situation</span>
            </span>
          </button>

          <button
            type="button"
            className={`step-tab-button ${activeStep === 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}
            onClick={() => goToStep(2)}
            aria-current={activeStep === 2 ? 'step' : undefined}
          >
            <span className="step-badge-number">2</span>
            <span className="step-tab-labels">
              <span className="step-sublabel">Step 2 of 3</span>
              <span className="step-mainlabel">Get Ready</span>
            </span>
          </button>

          <button
            type="button"
            className={`step-tab-button ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => goToStep(3)}
            aria-current={activeStep === 3 ? 'step' : undefined}
          >
            <span className="step-badge-number">3</span>
            <span className="step-tab-labels">
              <span className="step-sublabel">Step 3 of 3</span>
              <span className="step-mainlabel">Your Call Plan</span>
            </span>
          </button>
        </nav>

        {/* Step 1: Your Situation */}
        {activeStep === 1 && (
          <StepSituation
            questions={journey.situationQuestions}
            answers={situationAnswers}
            onSelectOption={handleSelectSituationOption}
            onNext={() => goToStep(2)}
            onBackToJourneys={onHomeClick}
            onStartAgain={onStartAgain}
          />
        )}

        {/* Step 2: Get Ready */}
        {activeStep === 2 && (
          <div className="content-section-panel">
            <div className="panel-header-row">
              <div>
                <div className="step-counter-pill">Step 2 of 3</div>
                <h3 className="panel-title">Get Ready</h3>
                <p className="panel-desc">
                  Review your tailored preparation checklist, select the questions you want to ask, and note what only your provider can confirm.
                </p>
              </div>
            </div>

            <StepChecklist
              checklist={fullChecklist}
              checkedItems={checkedItems}
              onToggleItem={handleToggleChecklist}
            />

            <StepQuestions
              questions={journey.suggestedQuestions}
              selectedQuestionIds={selectedQuestionIds}
              onToggleQuestion={handleToggleQuestion}
            />

            <StepProviderLimits
              providerOnlyItems={journey.providerOnlyItems}
            />

            <div className="flow-navigation-bar no-print">
              <div className="flow-nav-left">
                <button
                  type="button"
                  className="btn-flow-back"
                  onClick={() => goToStep(1)}
                >
                  &larr; Back to Step 1: Your situation
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
                  onClick={() => goToStep(3)}
                >
                  <span>Continue to Step 3: Your call plan</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Your Call Plan */}
        {activeStep === 3 && (
          <StepActionPlan
            journey={journey}
            situationAnswers={situationAnswers}
            fullChecklist={fullChecklist}
            checkedItems={checkedItems}
            selectedQuestionIds={selectedQuestionIds}
            userNotes={userNotes}
            onNotesChange={handleNotesChange}
            onPrint={handlePrint}
            onStartAgain={onStartAgain}
            onBackToStep2={() => goToStep(2)}
          />
        )}
      </div>
    </div>
  );
};
