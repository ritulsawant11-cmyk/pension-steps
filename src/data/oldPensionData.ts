import { KnowledgeOption, ReadinessChecklistItem, GuidanceBranch, ReadinessStatus } from '../types';

export const STEP1_KNOWLEDGE_OPTIONS: KnowledgeOption[] = [
  {
    id: 'old_letter',
    title: 'An old pension letter or statement.',
    hint: 'Paperwork, annual benefit review, or joining notice from that era.',
    icon: '📄',
  },
  {
    id: 'provider_name',
    title: 'The pension provider’s name.',
    hint: 'The insurance company, master trust, or administrator who managed it.',
    icon: '🏛️',
  },
  {
    id: 'policy_number',
    title: 'A policy or member number.',
    hint: 'A reference number found on old statements, letters, or salary slips.',
    icon: '🔢',
  },
  {
    id: 'employer_name',
    title: 'A former employer’s name.',
    hint: 'The company, firm, partnership, or organisation you worked for at the time.',
    icon: '🏢',
  },
  {
    id: 'employment_dates',
    title: 'Rough dates when I worked there.',
    hint: 'Approximate start and leave years, even if exact months are uncertain.',
    icon: '📅',
  },
  {
    id: 'previous_name_address',
    title: 'A previous name or address linked to the pension.',
    hint: 'A former surname, maiden name, or town/house where you lived at the time.',
    icon: '📍',
  },
  {
    id: 'very_little',
    title: 'Very little — I need help finding a starting point.',
    hint: 'You believe you paid into a pension, but details have been lost over time.',
    icon: '🧭',
    isExclusive: true,
  },
];

export const STEP2_CHECKLIST_ITEMS: ReadinessChecklistItem[] = [
  {
    id: 'policy_number',
    title: 'Policy or member number, if available',
    description: 'Found on policy schedules, benefit statements, or joining certificates.',
    securityNote: 'Have it written down on paper for your call. Never enter policy numbers on this website.',
    relevantIf: (known) => !known.includes('very_little'),
  },
  {
    id: 'ni_number',
    title: 'National Insurance number, if available',
    description: 'Found on your NI card, payslips, P60, or online HMRC personal tax account.',
    securityNote: 'Keep your NI number ready for provider security checks. Do not enter it on PensionSteps. A National Insurance number helps with a search, but does not guarantee a policy will be found or replace identity verification.',
  },
  {
    id: 'names',
    title: 'Current name and any previous names',
    description: 'Your current legal name, plus any maiden names, previous married names, or different spellings used during that employment.',
  },
  {
    id: 'addresses',
    title: 'Current address and previous addresses you remember',
    description: 'Particularly the address where you lived while working for that employer.',
    hint: 'You do not need a complete unbroken address history; noting down the town, street name, or approximate postcode is helpful.',
  },
  {
    id: 'employment_dates',
    title: 'Approximate employment dates',
    description: 'Approximate years when you joined and left that employer (e.g. "roughly 1998 to 2004").',
  },
  {
    id: 'employer_name',
    title: 'Former employer name',
    description: 'The company name, trading name, subsidiary, or organisation you worked for.',
  },
  {
    id: 'provider_or_scheme',
    title: 'Pension scheme, provider or administrator name',
    description: 'The specific workplace trust name, original insurance provider, or master trust, if remembered.',
  },
  {
    id: 'paperwork',
    title: 'Old letters, statements or other relevant paperwork',
    description: 'Old P45s, P60s, contracts of employment, or payslips showing pension deductions.',
  },
];

// Helper functions for clean entity detection across steps
export const isEmployerKnown = (known: string[], readiness: Record<string, ReadinessStatus>): boolean =>
  known.includes('employer_name') || readiness['employer_name'] === 'have';

export const isProviderKnown = (known: string[], readiness: Record<string, ReadinessStatus>): boolean =>
  known.includes('provider_name') || readiness['provider_or_scheme'] === 'have';

export const isPolicyNumberKnown = (known: string[], readiness: Record<string, ReadinessStatus>): boolean =>
  known.includes('policy_number') || readiness['policy_number'] === 'have';

// Synchronise Step 2 readinessStatus when Step 1 knownDetails changes
export const syncReadinessWithKnown = (
  nextKnown: string[],
  prevReadiness: Record<string, ReadinessStatus>
): Record<string, ReadinessStatus> => {
  if (nextKnown.includes('very_little')) {
    return {
      ...prevReadiness,
      policy_number: 'unsure',
      ni_number: prevReadiness['ni_number'] || 'unsure',
      names: 'have',
      addresses: 'look',
      employment_dates: 'look',
      employer_name: 'look',
      provider_or_scheme: 'look',
      paperwork: 'look',
    };
  }
  return {
    ...prevReadiness,
    paperwork: nextKnown.includes('old_letter') ? 'have' : 'look',
    provider_or_scheme: nextKnown.includes('provider_name') ? 'have' : 'look',
    policy_number: nextKnown.includes('policy_number') ? 'have' : 'unsure',
    employer_name: nextKnown.includes('employer_name') ? 'have' : 'look',
    employment_dates: nextKnown.includes('employment_dates') ? 'have' : 'look',
    addresses: nextKnown.includes('previous_name_address') ? 'have' : 'look',
  };
};

// Synchronise Step 1 knownDetails when Step 2 readinessStatus changes
export const syncKnownWithReadiness = (
  itemId: string,
  status: ReadinessStatus,
  prevKnown: string[]
): string[] => {
  const step2ToStep1Map: Record<string, string> = {
    paperwork: 'old_letter',
    provider_or_scheme: 'provider_name',
    policy_number: 'policy_number',
    employer_name: 'employer_name',
    employment_dates: 'employment_dates',
    addresses: 'previous_name_address',
  };
  const mappedId = step2ToStep1Map[itemId];
  if (!mappedId) return prevKnown;

  let nextKnown = prevKnown.filter((k) => k !== 'very_little');
  if (status === 'have') {
    if (!nextKnown.includes(mappedId)) {
      nextKnown.push(mappedId);
    }
  } else {
    nextKnown = nextKnown.filter((k) => k !== mappedId);
  }
  return nextKnown;
};

export const STEP3_GUIDANCE_BRANCHES: GuidanceBranch[] = [
  {
    id: 'branch_a',
    badge: 'Guidance A • Provider Known',
    title: 'Provider known, policy number missing',
    summary: 'When you know the provider or scheme but lack a policy number, contact their historic policy search or customer servicing team directly.',
    keyPoints: [
      'Pension providers have dedicated procedures for tracing archived accounts when members do not have a policy reference.',
      'They will ask for your full name, previous names, date of birth, National Insurance number, and former addresses to search their database.',
      'Strict security verification is required before any policy details can be confirmed or discussed.',
    ],
    suggestedQuestions: [
      'I believe I may have an old pension with you, but I don’t have a policy number. What information do you need to check for a possible record?',
      'Can you search your archived systems using my National Insurance number, previous names, and previous addresses?',
      'What is your timescale for completing an historic record trace, and how will you send the outcome?',
    ],
    isActive: (known, readiness) =>
      isProviderKnown(known, readiness) && !isPolicyNumberKnown(known, readiness),
  },
  {
    id: 'branch_b',
    badge: 'Guidance B • Old Paperwork',
    title: 'Extracting clues from your old paperwork',
    summary: 'Old documents often contain the vital clues needed to unlock your pension trail.',
    keyPoints: [
      'Check the letterhead and footer for the provider or administrator name and regulatory registration details.',
      'Look for a 6-to-12 digit code labelled "Policy Number", "Member Reference", or "Scheme Ref".',
      'Note the date of the letter: older workplace schemes frequently merge or transfer to newer master trusts.',
      'Do not upload documents here. Verify contact details through official directories before dialling phone numbers on 15-year-old paper.',
    ],
    suggestedQuestions: [
      'I have historic paperwork from [approximate date] [referencing: enter reference if known]. Does your organisation still administer this scheme or policy?',
      'Has this scheme or my policy been transferred to another pension administrator or master trust?',
    ],
    isActive: (known, readiness) =>
      known.includes('old_letter') || readiness['paperwork'] === 'have',
  },
  {
    id: 'branch_c',
    badge: 'Guidance C • Employer Known',
    title: 'Former employer known, provider unknown',
    summary: 'Your former employer or the official Government Pension Tracing Service can help link your employer to the scheme administrator.',
    keyPoints: [
      'If your former employer is still trading, their HR or personnel department can tell you which company administered pensions for employees during your working years.',
      'If the employer has ceased trading or merged, use the government’s free Pension Tracing Service to locate the current scheme administrator.',
    ],
    officialLink: {
      url: 'https://www.gov.uk/find-pension-contact-details',
      label: 'GOV.UK — Find pension contact details',
      description: 'Free statutory government tool to find contact details for workplace pension schemes. Requires an employer or provider name. Provides contact details only; does not confirm pension ownership or value.',
    },
    suggestedQuestions: [
      'Who was the appointed scheme administrator or provider for employees who worked here during [approximate years]?',
      'Has the company pension scheme transferred to another provider or master trust?',
    ],
    isActive: (known, readiness) =>
      isEmployerKnown(known, readiness) && !isProviderKnown(known, readiness),
  },
  {
    id: 'branch_d',
    badge: 'Guidance D • Address / Name Gaps',
    title: 'Previous name or address uncertain',
    summary: 'It is normal not to remember an address from decades ago. Note down what you genuinely remember and be transparent with the provider.',
    keyPoints: [
      'Do not guess or invent address details to try and pass automated checks.',
      'Note down any fragment you remember: the town, county, street name, or former marital surname.',
      'Providers have secondary verification workflows when address history is incomplete, such as requesting certified photo ID (passport/driving licence) and current proof of residence.',
      'Never attempt to bypass security checks.',
    ],
    suggestedQuestions: [
      'What should I do if I cannot remember the old address?',
      'What alternative proof of identity do you require to discuss my record if my old address cannot be verified?',
    ],
    isActive: (known, readiness) =>
      isProviderKnown(known, readiness) && (readiness['names'] !== 'have' || readiness['addresses'] !== 'have'),
  },
  {
    id: 'branch_e',
    badge: 'Guidance E • Starting From Scratch',
    title: 'Checking past employment records & free tracing guidance',
    summary: 'When both employer and provider details are missing, checking your personal employment history and free official guidance can provide your first lead.',
    keyPoints: [
      'Reconstruct your career timeline: write down a list of jobs you held, locations, and approximate years.',
      'Check past employment files: search for old P45s, P60 end-of-year certificates, payslips showing pension deduction lines, or bank statements.',
      'Check your online HMRC Personal Tax Account to view your recorded employment history and former employer names.',
      'Reconnect with former colleagues: workmates from the same company or era may remember the scheme name.',
      'Review MoneyHelper’s free guide on tracing lost pensions.',
    ],
    officialLink: {
      url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions',
      label: 'MoneyHelper — Finding lost pensions guide',
      description: 'Free, independent guidance backed by HM Government on how to track down forgotten pensions step by step.',
    },
    suggestedQuestions: [
      'How can I check my past employment history (such as through my online HMRC Personal Tax Account or past P60s) to confirm the registered company name of my former employer?',
      'What records (such as past payslips, P45s, or bank statements) would help establish which organisation held my pension scheme?',
    ],
    isActive: (known, readiness) =>
      known.includes('very_little') || (!isEmployerKnown(known, readiness) && !isProviderKnown(known, readiness)),
  },
  {
    id: 'branch_f',
    badge: 'Guidance F • Contingency',
    title: 'Questions to ask if no record is found initially',
    summary: 'A negative initial search does not necessarily mean no pension exists; older records may be archived under another scheme name or administrator.',
    keyPoints: [
      'Workplace schemes regularly undergo mergers, wind-ups, or transfers to modern master trusts.',
      'Ask the provider if scheme records were moved to another company or if benefits were secured with an insurance company.',
      'Remember: PensionSteps cannot determine which organisation holds a pension without verified evidence.',
    ],
    suggestedQuestions: [
      'What additional information would help you conduct a more thorough search?',
      'Could the scheme or my policy have been transferred to another administrator or master trust?',
      'What is the appropriate next step if no match is found under my details?',
    ],
    isActive: (known, readiness) =>
      isProviderKnown(known, readiness),
  },
];
