import React from 'react';
import { ChecklistItem } from '../types';

interface StepChecklistProps {
  checklist: ChecklistItem[];
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
}

export const StepChecklist: React.FC<StepChecklistProps> = ({
  checklist,
  checkedItems,
  onToggleItem,
}) => {
  const completedCount = checklist.filter((item) => !!checkedItems[item.id]).length;
  const totalCount = checklist.length;

  return (
    <section className="content-sub-block" aria-labelledby="checklist-title">
      <div className="sub-block-header">
        <div>
          <h4 id="checklist-title" className="sub-block-title">
            Tailored Preparation Checklist
          </h4>
          <p className="sub-block-desc">
            Check off each item as you locate paperwork and verify key information. This builds your telephone readiness.
          </p>
        </div>
        <div className="progress-pill-badge" aria-live="polite">
          {completedCount} of {totalCount} Completed
        </div>
      </div>

      <div className="checklist-stack" role="group" aria-label="Preparation checklist items">
        {checklist.map((item) => {
          const isCompleted = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              className={`checklist-card-row ${isCompleted ? 'completed' : ''}`}
              onClick={() => onToggleItem(item.id)}
            >
              <input
                type="checkbox"
                id={`check-${item.id}`}
                className="checklist-checkbox-input"
                checked={isCompleted}
                onChange={() => onToggleItem(item.id)}
                onClick={(e) => e.stopPropagation()}
                aria-describedby={`hint-${item.id}`}
              />
              <div className="checklist-card-content">
                <div className="checklist-header-line">
                  <label
                    htmlFor={`check-${item.id}`}
                    className="checklist-item-title"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.label}
                  </label>
                  <span
                    className={`checklist-state-tag ${isCompleted ? 'done' : 'todo'}`}
                    aria-label={`Status: ${isCompleted ? 'Completed' : 'To check'}`}
                  >
                    <span aria-hidden="true">{isCompleted ? '✓' : '○'}</span>
                    <span>{isCompleted ? 'Completed' : 'To check'}</span>
                  </span>
                </div>
                <p id={`hint-${item.id}`} className="checklist-hint-text">
                  {item.hint}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
