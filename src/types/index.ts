export type ReadinessStatus = 'have' | 'look' | 'unsure';

export interface KnowledgeOption {
  id: string;
  title: string;
  hint: string;
  icon: string;
  isExclusive?: boolean;
}

export interface ReadinessChecklistItem {
  id: string;
  title: string;
  description: string;
  securityNote?: string;
  hint?: string;
  relevantIf?: (known: string[]) => boolean;
}

export interface GuidanceBranch {
  id: string;
  badge: string;
  title: string;
  summary: string;
  keyPoints: string[];
  suggestedQuestions: string[];
  officialLink?: {
    url: string;
    label: string;
    description: string;
  };
  isActive: (known: string[], readiness: Record<string, ReadinessStatus>) => boolean;
}

export interface OldPensionJourneyState {
  knownDetails: string[];
  readinessStatus: Record<string, ReadinessStatus>;
  selectedQuestionIds: Record<string, boolean>;
  userNotes: string;
  activeStep: number; // 1 to 4
}

export type JourneyId = 'old-pension-letter' | 'address-update' | 'third-party-help' | string;

export interface ChecklistItem {
  id: string;
  label: string;
  hint: string;
  importance?: 'essential' | 'recommended';
  source?: 'baseline' | 'tailored';
}

export interface SituationOption {
  value: string;
  label: string;
  tailoredChecklistItems?: ChecklistItem[];
}

export interface SituationQuestion {
  id: string;
  prompt: string;
  options: SituationOption[];
}

export interface SuggestedQuestion {
  id: string;
  question: string;
  context: string;
  tag: string;
}

export interface ProviderConfirmation {
  id: string;
  title: string;
  detail: string;
}

export interface JourneyData {
  id: JourneyId;
  cardTitle: string;
  cardSummary: string;
  tagline: string;
  overview: string;
  regulatoryNotice: string;
  situationQuestions: SituationQuestion[];
  baselineChecklist: ChecklistItem[];
  suggestedQuestions: SuggestedQuestion[];
  providerOnlyItems: ProviderConfirmation[];
}

export interface JourneyState {
  activeStep: number;
  situationAnswers: Record<string, string>;
  checkedItems: Record<string, boolean>;
  selectedQuestionIds: Record<string, boolean>;
  userNotes: string;
}
