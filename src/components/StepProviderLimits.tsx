import React from 'react';
import { ProviderConfirmation } from '../types';

interface StepProviderLimitsProps {
  providerOnlyItems: ProviderConfirmation[];
}

export const StepProviderLimits: React.FC<StepProviderLimitsProps> = ({
  providerOnlyItems,
}) => {
  return (
    <aside
      className="provider-limits-wrapper"
      aria-labelledby="provider-limits-title"
    >
      <div className="limits-eyebrow">Important Service Boundaries</div>
      <h4 id="provider-limits-title" className="limits-title-text">
        What only your authorised pension provider can confirm
      </h4>
      <p className="limits-intro-p">
        PensionSteps is an independent customer-preparation guide. For legal and data security reasons, only your scheme administrator has access to your records and can confirm or process the following:
      </p>

      <div className="limits-boxes-grid" role="list">
        {providerOnlyItems.map((item) => (
          <div key={item.id} className="limit-item-card" role="listitem">
            <h5>{item.title}</h5>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};
