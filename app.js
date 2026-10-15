/**
 * PensionSteps — Old-Pension Enquiry Preparation Tool
 * Independent UK Pension-Enquiry Preparation Tool
 * Zero-dependency standalone React-compatible runtime.
 */

// --- 1. React Mini-Runtime ---
const React = (() => {
  let currentComponent = null;
  let hookIndex = 0;

  function useState(initialValue) {
    const component = currentComponent;
    const index = hookIndex++;
    if (!component.hooks[index]) {
      component.hooks[index] = {
        state: typeof initialValue === 'function' ? initialValue() : initialValue,
      };
    }
    const hook = component.hooks[index];
    const setState = (newValue) => {
      const nextState = typeof newValue === 'function' ? newValue(hook.state) : newValue;
      if (nextState !== hook.state) {
        hook.state = nextState;
        scheduleRender();
      }
    };
    return [hook.state, setState];
  }

  function useEffect(callback, deps) {
    const component = currentComponent;
    const index = hookIndex++;
    const oldHook = component.hooks[index];
    const hasChanged = !oldHook || !deps || deps.some((dep, i) => dep !== oldHook.deps[i]);
    if (hasChanged) {
      if (oldHook && oldHook.cleanup) {
        try { oldHook.cleanup(); } catch (e) { console.error(e); }
      }
      component.effects.push({ callback, deps, index });
    }
  }

  function useRef(initialValue) {
    const component = currentComponent;
    const index = hookIndex++;
    if (!component.hooks[index]) {
      component.hooks[index] = { current: initialValue };
    }
    return component.hooks[index];
  }

  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...(props || {}),
        children: children.flat(Infinity).filter(c => c !== null && c !== undefined && c !== false),
      },
    };
  }

  return {
    useState,
    useEffect,
    useRef,
    createElement,
    Fragment: 'Fragment',
    _setCurrentComponent: (c) => { currentComponent = c; hookIndex = 0; },
  };
})();

// DOM Renderer
let rootElement = null;
let rootComponentFn = null;
let rootInstance = { hooks: [], effects: [] };
let renderScheduled = false;

function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    performRender();
  });
}

function performRender() {
  if (!rootElement || !rootComponentFn) return;
  try {
    React._setCurrentComponent(rootInstance);
    rootInstance.effects = [];
    const vdom = rootComponentFn();

    rootElement.innerHTML = '';
    const domNode = renderVNode(vdom);
    if (domNode) {
      rootElement.appendChild(domNode);
    }

    rootInstance.effects.forEach(eff => {
      const hook = rootInstance.hooks[eff.index] || {};
      if (typeof eff.callback === 'function') {
        hook.cleanup = eff.callback();
      }
      hook.deps = eff.deps;
      rootInstance.hooks[eff.index] = hook;
    });
  } catch (err) {
    console.error('Error during performRender:', err);
  }
}

function renderVNode(vnode) {
  if (vnode === null || vnode === undefined || vnode === false) {
    return document.createTextNode('');
  }
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach(child => {
      const childNode = renderVNode(child);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  if (vnode.type === 'Fragment') {
    const fragment = document.createDocumentFragment();
    (vnode.props.children || []).forEach(child => {
      const childNode = renderVNode(child);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  if (typeof vnode.type === 'function') {
    const childVNode = vnode.type(vnode.props);
    return renderVNode(childVNode);
  }

  const svgTags = new Set(['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text']);
  const el = svgTags.has(vnode.type)
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.type)
    : document.createElement(vnode.type);

  const props = vnode.props || {};

  Object.keys(props).forEach(key => {
    if (key === 'children') return;

    if (key.startsWith('on') && typeof props[key] === 'function') {
      const eventName = key.substring(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else if (key === 'className') {
      if (svgTags.has(vnode.type)) {
        el.setAttribute('class', props[key]);
      } else {
        el.className = props[key];
      }
    } else if (key === 'style' && typeof props[key] === 'object') {
      Object.assign(el.style, props[key]);
    } else if (key === 'htmlFor') {
      el.setAttribute('for', props[key]);
    } else if (key === 'checked') {
      el.checked = Boolean(props[key]);
      if (props[key]) {
        el.setAttribute('checked', '');
      } else {
        el.removeAttribute('checked');
      }
    } else if (key === 'value') {
      el.value = props[key];
    } else if (key === 'disabled') {
      if (props[key]) {
        el.setAttribute('disabled', '');
        el.disabled = true;
      } else {
        el.removeAttribute('disabled');
        el.disabled = false;
      }
    } else if (typeof props[key] === 'boolean') {
      if (key.startsWith('aria-')) {
        el.setAttribute(key, String(props[key]));
      } else if (props[key]) {
        el.setAttribute(key, '');
        if (key in el) el[key] = true;
      } else {
        el.removeAttribute(key);
        if (key in el) el[key] = false;
      }
    } else if (props[key] === undefined || props[key] === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, props[key]);
    }
  });

  (props.children || []).forEach(child => {
    const childNode = renderVNode(child);
    if (childNode) el.appendChild(childNode);
  });

  return el;
}

const h = React.createElement;

// --- 2. Data Definitions for Old-Pension Enquiry Tool ---

const STEP1_KNOWLEDGE_OPTIONS = [
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
    hint: 'Approximate start and leaving years, even if exact months are uncertain.',
    icon: '📅',
  },
  {
    id: 'previous_name_address',
    title: 'A previous name or address linked to the pension.',
    hint: 'A former surname, maiden name, or town/house where you lived during that job.',
    icon: '📍',
  },
  {
    id: 'very_little',
    title: 'Very little — I need help finding a starting point.',
    hint: 'You believe you had a pension, but details have been lost over time.',
    icon: '🧭',
    isExclusive: true,
  },
];

const STEP2_CHECKLIST_ITEMS = [
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
const isEmployerKnown = (known, readiness) =>
  known.includes('employer_name') || readiness['employer_name'] === 'have';

const isProviderKnown = (known, readiness) =>
  known.includes('provider_name') || readiness['provider_or_scheme'] === 'have';

const isPolicyNumberKnown = (known, readiness) =>
  known.includes('policy_number') || readiness['policy_number'] === 'have';

// Synchronise Step 2 readinessStatus when Step 1 knownDetails changes
const syncReadinessWithKnown = (nextKnown, prevReadiness) => {
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
const syncKnownWithReadiness = (itemId, status, prevKnown) => {
  const step2ToStep1Map = {
    paperwork: 'old_letter',
    provider_or_scheme: 'provider_name',
    policy_number: 'policy_number',
    employer_name: 'employer_name',
    employment_dates: 'employment_dates',
    addresses: 'previous_name_address',
  };
  const mappedId = step2ToStep1Map[itemId];
  if (!mappedId) return prevKnown;

  let nextKnown = prevKnown.filter(k => k !== 'very_little');
  if (status === 'have') {
    if (!nextKnown.includes(mappedId)) {
      nextKnown.push(mappedId);
    }
  } else {
    nextKnown = nextKnown.filter(k => k !== mappedId);
  }
  return nextKnown;
};

const STEP3_GUIDANCE_BRANCHES = [
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

// Helper: initial journey state
const createInitialJourneyState = () => ({
  knownDetails: [],
  readinessStatus: {
    policy_number: 'unsure',
    ni_number: 'unsure',
    names: 'have',
    addresses: 'look',
    employment_dates: 'look',
    employer_name: 'look',
    provider_or_scheme: 'look',
    paperwork: 'look',
  },
  selectedQuestionIds: {},
  userNotes: '',
  activeStep: 1,
});

// PDF 1.4 Generator for Old Pension Enquiry Plan
function generateOldPensionPdf(state, activeBranches, selectedQuestions) {
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const escapePdfText = (txt) => {
    return (txt || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E]/g, ' ');
  };

  const lines = [];
  lines.push('BT');
  lines.push('/F1 16 Tf');
  lines.push('50 780 Td');
  lines.push(`(${escapePdfText('PensionSteps — Old-Pension Enquiry Preparation Plan')}) Tj`);

  lines.push('/F2 9 Tf');
  lines.push('0 -14 Td');
  lines.push(`(${escapePdfText(`Date Prepared: ${currentDate} | Independent Preparation Tool (Not Financial Advice)`)}) Tj`);

  lines.push('0 -22 Td');
  lines.push('/F1 11 Tf');
  lines.push(`(${escapePdfText('1. SITUATION SUMMARY')}) Tj`);
  lines.push('/F2 9 Tf');

  const knownTitles = state.knownDetails.length > 0
    ? state.knownDetails.map(id => {
        const item = STEP1_KNOWLEDGE_OPTIONS.find(o => o.id === id);
        return item ? item.title : id;
      })
    : ['Very little — starting from scratch'];

  lines.push('0 -13 Td');
  lines.push(`(${escapePdfText(`What is currently known: ${knownTitles.join('; ')}`)}) Tj`);

  const employerStatus = isProviderKnown(state.knownDetails, state.readinessStatus) && isEmployerKnown(state.knownDetails, state.readinessStatus)
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

  STEP2_CHECKLIST_ITEMS.forEach(item => {
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

  const offsets = [];
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
}

// --- 3. UI Components ---

function Header({ onHomeClick, onAboutClick, onStartJourney, onHowItWorksClick, onResourcesClick }) {
  return h(
    'header',
    { className: 'site-header', role: 'banner' },
    h(
      'div',
      { className: 'container header-inner' },
      h(
        'button',
        {
          type: 'button',
          onClick: onHomeClick,
          className: 'brand brand-link',
          'aria-label': 'PensionSteps Home',
        },
        h('span', { className: 'brand-mark', 'aria-hidden': 'true' }, 'p'),
        h(
          'div',
          { className: 'brand-title-wrap' },
          h('span', { className: 'brand-name' }, 'PensionSteps'),
          h('span', { className: 'brand-pill-badge' }, 'Old-Pension Enquiry Preparation')
        )
      ),
      h(
        'nav',
        { className: 'site-nav header-nav', 'aria-label': 'Main menu' },
        h('button', { type: 'button', onClick: onHowItWorksClick, className: 'nav-link' }, 'How it works'),
        h('button', { type: 'button', onClick: onAboutClick, className: 'nav-link', 'aria-haspopup': 'dialog' }, 'About & Safeguards'),
        h('button', { type: 'button', onClick: onResourcesClick, className: 'nav-link' }, 'Official resources')
      ),
      h(
        'div',
        { className: 'header-action-group' },
        h(
          'button',
          { type: 'button', onClick: onStartJourney, className: 'btn btn-primary btn-sm btn-header-cta' },
          h('span', null, 'Prepare my pension enquiry')
        )
      )
    )
  );
}

function Hero({ onStartJourney, onHowItWorksClick }) {
  return h(
    'section',
    { className: 'hero hero-section', 'aria-labelledby': 'hero-main-heading' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'hero-grid' },
        // Left Column Content
        h(
          'div',
          { className: 'hero-left-col' },
          h(
            'div',
            { className: 'availability hero-service-badge' },
            'Independent pension-enquiry preparation tool'
          ),
          h(
            'h1',
            { id: 'hero-main-heading', className: 'hero-headline' },
            'An old pension. Missing details. ',
            h('em', null, 'A clearer next step.')
          ),
          h(
            'p',
            { className: 'hero-intro hero-subtext' },
            'Not sure of your policy number, old address or pension provider? Organise what you remember and prepare for your next enquiry.'
          ),
          h(
            'div',
            { className: 'hero-actions hero-buttons-row' },
            h(
              'button',
              { type: 'button', className: 'btn btn-primary btn-primary-teal', onClick: onStartJourney, id: 'hero-prepare-btn' },
              h('span', null, 'Prepare my pension enquiry'),
              h('span', { className: 'btn-arrow-icon', 'aria-hidden': 'true' }, ' →')
            ),
            h(
              'button',
              { type: 'button', className: 'btn btn-ghost btn-secondary-link', onClick: onHowItWorksClick },
              h('span', null, 'See how it works')
            )
          ),
          h(
            'div',
            { className: 'hero-reassurance-text' },
            'PensionSteps is an independent preparation tool. It does not search for pensions or contact providers on your behalf. Free to use. No account needed.'
          )
        ),
        // Right Column: Fieldnotes Notebook Call-Plan Preview
        h(
          'div',
          { className: 'hero-preview-col', 'aria-label': 'Example call plan preview' },
          h(
            'div',
            { className: 'notebook example-plan-card' },
            h(
              'div',
              { className: 'notebook-top example-plan-top-bar' },
              h('span', { className: 'example-plan-badge' }, 'PENSIONSTEPS CALL PLAN • YOUR CALL PLAN'),
              h('span', { className: 'example-plan-chip' }, 'A4 Printable • Example')
            ),
            h('h2', { className: 'notebook-title' }, 'Example call plan'),
            h(
              'div',
              { className: 'plan-preview-sections' },
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'What I want to discuss'),
                h('div', { className: 'preview-block-content' }, 'Think I had a pension with a former employer 20 years ago. Missing policy number and unconfirmed provider.')
              ),
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'Information to have ready / Before you call'),
                h(
                  'ul',
                  { className: 'example-checklist-list', style: { listStyle: 'none', padding: 0, margin: 0 } },
                  h('li', null, '✓ Approximate employment years (roughly 1999–2004)'),
                  h('li', null, '✓ National Insurance number ready on desk (not entered online)'),
                  h('li', null, '✓ Former workplace address at that time')
                )
              ),
              h(
                'div',
                { className: 'preview-block example-plan-section' },
                h('div', { className: 'preview-block-heading plan-section-label' }, 'Questions to ask'),
                h(
                  'div',
                  { className: 'example-question-box' },
                  h('div', { className: 'example-q-item' }, '1. What information do you need to check for a possible record?'),
                  h('div', { className: 'example-q-item' }, '2. Can you search using my National Insurance number and old address?')
                )
              ),
              h(
                'div',
                { className: 'preview-block' },
                h('div', { className: 'preview-block-heading' }, 'Notes and next steps'),
                h('div', { className: 'preview-block-content' }, 'Adviser: ___________________ | Ref: _________ | Follow-up: _______')
              )
            ),
            h(
              'div',
              { className: 'stamp', 'aria-hidden': 'true' },
              'EXAMPLE',
              h('br', null),
              'CALL PLAN',
              h('br', null),
              '✳'
            )
          )
        )
      )
    )
  );
}

function HowItWorksSection({ onStartJourney }) {
  return h(
    'section',
    { id: 'how-it-works-section', className: 'section how-it-works-section', 'aria-labelledby': 'how-it-works-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '01 / HOW IT WORKS'),
        h(
          'h2',
          { id: 'how-it-works-title', className: 'section-title section-main-heading' },
          'Three simple ',
          h('em', null, 'steps.')
        ),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'Preparing beforehand keeps your enquiry structured, avoids security rejections, and prevents missed questions.')
      ),
      h(
        'div',
        { className: 'how-it-works-grid' },
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '01'),
          h('h3', { className: 'how-step-title' }, 'Tell us what you know'),
          h('p', { className: 'how-step-desc' }, 'Select what details or paperwork you still have, or start with very little. It’s okay if you don’t remember everything.')
        ),
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '02'),
          h('h3', { className: 'how-step-title' }, 'Review what to have ready'),
          h('p', { className: 'how-step-desc' }, 'Organise key information like your NI number and employment dates without entering them online.')
        ),
        h(
          'div',
          { className: 'how-step-card' },
          h('span', { className: 'how-step-badge' }, '03'),
          h('h3', { className: 'how-step-title' }, 'Create your enquiry plan'),
          h('p', { className: 'how-step-desc' }, 'Print or download your 1-page call plan with tailored questions, contact guidance, and dedicated note-taking space.')
        )
      ),
      h(
        'div',
        { style: { textAlign: 'center', marginTop: '36px' } },
        h(
          'button',
          { type: 'button', className: 'btn btn-primary', onClick: onStartJourney },
          h('span', null, 'Prepare my pension enquiry'),
          h('span', { 'aria-hidden': 'true' }, ' →')
        )
      )
    )
  );
}

function SafeguardsSection({ onAboutClick }) {
  return h(
    'section',
    { id: 'about-section', className: 'section safeguards-split-section', 'aria-labelledby': 'about-section-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '02 / ABOUT & SAFEGUARDS'),
        h(
          'h2',
          { id: 'about-section-title', className: 'section-title section-main-heading' },
          'Independent enquiry ',
          h('em', null, 'preparation.')
        )
      ),
      h(
        'div',
        { className: 'about-grid safeguards-split-grid' },
        h(
          'div',
          { className: 'about-content-col safeguards-content-col' },
          h('p', { className: 'about-copy' }, 'PensionSteps helps people prepare to contact a pension provider about an old pension when they have incomplete information.'),
          h('p', { className: 'about-sub section-lead-paragraph' }, 'When tracing historic pensions, it helps to keep three distinct concepts in mind:'),
          h(
            'ol',
            { style: { margin: '0 0 20px 20px', padding: 0, fontSize: '0.94rem', color: 'var(--ink)', lineHeight: '1.7' } },
            h('li', null, h('strong', null, 'Identifying an organisation to contact: '), 'Finding the former employer’s HR contact or current scheme administrator.'),
            h('li', null, h('strong', null, 'Asking that organisation to search for a record: '), 'Providing approximate dates and names so they can query archived files.'),
            h('li', null, h('strong', null, 'Completing identity and security checks: '), 'Providing official identification before any financial or policy data is disclosed.')
          ),
          h(
            'div',
            { className: 'safeguards-btn-wrap', style: { marginTop: '20px' } },
            h(
              'button',
              { type: 'button', className: 'btn btn-secondary btn-primary-teal', onClick: onAboutClick },
              h('span', null, 'Read our full safeguards & service boundaries'),
              h('span', { 'aria-hidden': 'true' }, ' →')
            )
          )
        ),
        h(
          'div',
          { className: 'about-skills-col' },
          h(
            'ul',
            { className: 'skill-list safeguards-pill-list' },
            h('li', null, '✓ Free to use'),
            h('li', null, '✓ No account needed'),
            h('li', null, '✓ Zero personal data collected'),
            h('li', null, '✓ Independent preparation — not financial advice'),
            h('li', null, '✓ Does not search provider databases'),
            h('li', null, '✓ Plain English checklists'),
            h('li', null, '✓ Printable 1-page call plan'),
            h('li', null, '✓ In-memory browser session only')
          )
        )
      )
    )
  );
}

function OfficialResourcesSection() {
  return h(
    'section',
    { id: 'resources-section', className: 'section', 'aria-labelledby': 'resources-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, 'OFFICIAL UK RESOURCES'),
        h('h2', { id: 'resources-title', className: 'section-title section-main-heading' }, 'Verified government & public ', h('em', null, 'guidance.')),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'Free statutory services that help you find contact details and resolve pension questions.')
      ),
      h(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' } },
        h(
          'div',
          { className: 'project-card', style: { padding: '28px' } },
          h('div', { className: 'project-meta' }, 'GOV.UK STATUTORY TOOL'),
          h('h3', { className: 'card-title-heading' }, 'Find pension contact details'),
          h('p', { className: 'card-summary-desc' }, 'The official government database holding contact details for workplace and personal schemes. It finds contact details only; it does not verify individual pots or values.'),
          h(
            'div',
            { className: 'card-bottom-action' },
            h('a', { href: 'https://www.gov.uk/find-pension-contact-details', target: '_blank', rel: 'noopener noreferrer', className: 'btn-card-link' },
              h('span', null, 'Visit gov.uk/find-pension-contact-details'),
              h('span', { className: 'btn-card-arrow-circle', 'aria-hidden': 'true' }, '↗')
            )
          )
        ),
        h(
          'div',
          { className: 'project-card', style: { padding: '28px' } },
          h('div', { className: 'project-meta' }, 'MONEYHELPER SERVICE'),
          h('h3', { className: 'card-title-heading' }, 'Tracing and finding lost pensions'),
          h('p', { className: 'card-summary-desc' }, 'Backed by HM Government, MoneyHelper offers comprehensive guidance on how to track down forgotten workplace and personal pensions step by step.'),
          h(
            'div',
            { className: 'card-bottom-action' },
            h('a', { href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions', target: '_blank', rel: 'noopener noreferrer', className: 'btn-card-link' },
              h('span', null, 'Read MoneyHelper tracing guide'),
              h('span', { className: 'btn-card-arrow-circle', 'aria-hidden': 'true' }, '↗')
            )
          )
        )
      )
    )
  );
}

function FAQSection() {
  return h(
    'section',
    { id: 'faq-section', className: 'section faq-section', 'aria-labelledby': 'faq-main-title' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'section-header section-center-header' },
        h('div', { className: 'section-number' }, '03 / FAQ'),
        h(
          'h2',
          { id: 'faq-main-title', className: 'section-title section-main-heading' },
          'Frequently asked ',
          h('em', null, 'questions.')
        ),
        h('p', { className: 'section-sub section-lead-paragraph' }, 'Common practical questions about contacting pension administrators with missing details.')
      ),
      h(
        'div',
        { className: 'faq-grid' },
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' What if I only remember my former employer’s name?'),
          h('p', { className: 'faq-answer-text' }, 'That is a very common starting point. Your former employer’s HR department or the government Pension Tracing Service can help you identify the scheme administrator who manages records for that employer.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' Does having my National Insurance number mean a pension will be found?'),
          h('p', { className: 'faq-answer-text' }, 'No. A National Insurance number helps providers check archived records, but a match depends on whether scheme records were digitised and kept up to date. It does not guarantee a policy exists or replace formal identity checks.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' Can PensionSteps look up my pension or contact providers?'),
          h('p', { className: 'faq-answer-text' }, 'No. PensionSteps is an independent customer-preparation tool. It does not access pension provider databases or submit enquiries on your behalf. All preparations remain private in your browser.')
        ),
        h(
          'article',
          { className: 'faq-card' },
          h('h3', { className: 'faq-question-title' }, h('span', { className: 'faq-q-indicator' }, 'Q.'), ' What if I don’t remember my old address?'),
          h('p', { className: 'faq-answer-text' }, 'Note down the town, approximate area, or street you remember. Inform the provider honestly that your address history is incomplete. They have procedures for searching archived files with unconfirmed addresses and will specify what proof of identity they require.')
        )
      )
    )
  );
}

function CTACalloutSection({ onStartJourney }) {
  return h(
    'section',
    { className: 'section cta-callout-section', 'aria-labelledby': 'cta-callout-heading' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'contact-panel cta-callout-card' },
        h(
          'div',
          { className: 'contact-panel-content cta-callout-text' },
          h(
            'h2',
            { id: 'cta-callout-heading', className: 'cta-callout-title' },
            'Ready to prepare your ',
            h('em', null, 'enquiry?')
          ),
          h('p', { className: 'cta-callout-desc' }, 'Organise what you remember, review what to have ready, and create your printable enquiry plan in minutes.')
        ),
        h(
          'div',
          null,
          h(
            'button',
            { type: 'button', className: 'btn btn-primary btn-callout-action', onClick: onStartJourney },
            h('span', null, 'Prepare my pension enquiry'),
            h('span', { 'aria-hidden': 'true' }, ' →')
          )
        )
      )
    )
  );
}

// --- 4. Guided Journey Flow Component (Steps 1 to 4) ---

function GuidedJourneyFlow({ state, onUpdateState, onHomeClick, onStartAgain }) {
  const currentStep = state.activeStep;

  // Compute active guidance branches
  const activeBranches = STEP3_GUIDANCE_BRANCHES.filter(branch =>
    branch.isActive(state.knownDetails, state.readinessStatus)
  );

  // Stepper labels
  const stepsMeta = [
    { num: 1, title: 'What you know', sub: 'Step 1 of 4' },
    { num: 2, title: 'Have ready', sub: 'Step 2 of 4' },
    { num: 3, title: 'Guidance', sub: 'Step 3 of 4' },
    { num: 4, title: 'Enquiry plan', sub: 'Step 4 of 4' },
  ];

  const handleStepClick = (targetStep) => {
    // Only allow navigating backwards or to currently unlocked steps
    if (targetStep < currentStep) {
      onUpdateState({ activeStep: targetStep });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 1: toggle knowledge option
  const handleToggleKnowledge = (id, isExclusive) => {
    let nextKnown = [...state.knownDetails];
    if (isExclusive) {
      // If toggling exclusive option on, clear others; if already on, remove it
      if (nextKnown.includes(id)) {
        nextKnown = [];
      } else {
        nextKnown = [id];
      }
    } else {
      // Remove exclusive option if active
      nextKnown = nextKnown.filter(k => k !== 'very_little');
      if (nextKnown.includes(id)) {
        nextKnown = nextKnown.filter(k => k !== id);
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
  const handleSetStatus = (itemId, status) => {
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
  const handleToggleQuestion = (qText) => {
    const current = state.selectedQuestionIds[qText] !== false; // default true
    onUpdateState({
      selectedQuestionIds: {
        ...state.selectedQuestionIds,
        [qText]: !current,
      },
    });
  };

  // Step 4 questions to display
  const allSuggestedQuestions = [];
  activeBranches.forEach(b => {
    b.suggestedQuestions.forEach(q => {
      if (!allSuggestedQuestions.includes(q)) {
        allSuggestedQuestions.push(q);
      }
    });
  });

  const selectedQuestions = allSuggestedQuestions.filter(q =>
    state.selectedQuestionIds[q] !== false
  );

  const handleDownloadPdf = () => {
    generateOldPensionPdf(state, activeBranches, selectedQuestions);
  };

  return h(
    'div',
    { className: 'journey-page-wrapper' },
    h(
      'div',
      { className: 'container journey-focused-container' },
      // Stepper Bar
      h(
        'div',
        { className: 'journey-stepper-bar no-print', role: 'navigation', 'aria-label': 'Enquiry preparation progress' },
        stepsMeta.map(sm => {
          const isActive = sm.num === currentStep;
          const isCompleted = sm.num < currentStep;
          return h(
            'button',
            {
              key: sm.num,
              type: 'button',
              className: `step-tab-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`,
              onClick: () => handleStepClick(sm.num),
              disabled: sm.num > currentStep,
              'aria-current': isActive ? 'step' : undefined,
            },
            h('span', { className: 'step-badge-number' }, isCompleted ? '✓' : sm.num),
            h(
              'span',
              { className: 'step-tab-labels' },
              h('span', { className: 'step-sublabel' }, sm.sub),
              h('span', { className: 'step-mainlabel' }, sm.title)
            )
          );
        })
      ),

      // STEP 1: WHAT DO YOU KNOW?
      currentStep === 1 &&
        h(
          'div',
          { className: 'content-section-panel' },
          h('div', { className: 'section-number' }, 'STEP 1 OF 4 — WHAT DO YOU KNOW?'),
          h('h2', { className: 'section-title', style: { marginBottom: '8px' } }, 'What do you still have or remember?'),
          h('p', { className: 'section-sub', style: { marginBottom: '20px' } }, 'Select all that apply. It’s okay if you don’t remember everything. Start with what you know, and we will tailor the next steps.'),
          h(
            'div',
            { className: 'security-notice-callout' },
            h('span', { 'aria-hidden': 'true', style: { fontSize: '1.2rem' } }, 'ℹ️'),
            h('div', null,
              h('strong', null, 'Start with what you know: '),
              'Pension administrators understand that records from 15–25 years ago often have missing details. You can continue with incomplete information. Do not enter actual personal identifiers or numbers on this website.'
            )
          ),
          h(
            'div',
            { className: 'knowledge-options-group', role: 'group', 'aria-label': 'Information you currently have or remember' },
            STEP1_KNOWLEDGE_OPTIONS.map(opt => {
              const isSelected = Array.isArray(state.knownDetails) && state.knownDetails.includes(opt.id);
              return h(
                'div',
                {
                  key: opt.id,
                  className: `knowledge-option-card ${isSelected ? 'selected' : ''} ${opt.isExclusive ? 'knowledge-option-exclusive' : ''}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    handleToggleKnowledge(opt.id, opt.isExclusive);
                  },
                  role: 'checkbox',
                  'aria-checked': isSelected,
                  tabIndex: 0,
                  onKeyDown: (e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleToggleKnowledge(opt.id, opt.isExclusive);
                    }
                  },
                },
                h('span', { className: 'chk-box-custom', 'aria-hidden': 'true' }, isSelected ? '✓' : ''),
                h(
                  'div',
                  { style: { flex: 1, pointerEvents: 'none' } },
                  h('div', { style: { fontWeight: 600, color: 'var(--ink)', fontSize: '0.98rem' } }, opt.title),
                  h('div', { style: { fontSize: '0.86rem', color: 'var(--muted)', marginTop: '2px' } }, opt.hint)
                ),
                h('span', { 'aria-hidden': 'true', style: { fontSize: '1.2rem', pointerEvents: 'none' } }, opt.icon)
              );
            })
          ),
          // Nav Bar
          h(
            'div',
            { className: 'flow-navigation-bar' },
            h('div', { className: 'flow-nav-left' },
              h('button', { type: 'button', className: 'btn-flow-back', onClick: onHomeClick }, '← Return to overview')
            ),
            h('div', { className: 'flow-nav-right' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'btn-flow-next',
                  onClick: () => {
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
                  },
                },
                h('span', null, (!state.knownDetails || state.knownDetails.length === 0) ? 'Continue (start with what I have)' : 'Continue to Step 2'),
                h('span', { 'aria-hidden': 'true' }, ' →')
              )
            )
          )
        ),

      // STEP 2: WHAT INFORMATION CAN YOU HAVE READY?
      currentStep === 2 &&
        h(
          'div',
          { className: 'content-section-panel' },
          h('div', { className: 'section-number' }, 'STEP 2 OF 4 — WHAT TO HAVE READY'),
          h('h2', { className: 'section-title', style: { marginBottom: '8px' } }, 'Review what information you can have ready'),
          h('p', { className: 'section-sub', style: { marginBottom: '16px' } }, 'For each item, indicate whether you have it ready on paper, need to look for it, or are unsure. We adapt your checklist accordingly.'),
          h(
            'div',
            { className: 'security-notice-callout' },
            h('span', { 'aria-hidden': 'true', style: { fontSize: '1.2rem' } }, '🔒'),
            h('div', null,
              h('strong', null, 'Have sensitive information ready for the provider, but do not enter it on PensionSteps.'),
              h('p', { style: { margin: '4px 0 0', fontSize: '0.84rem' } },
                'No fields are provided for entering actual policy numbers, NI numbers, or full addresses. None of these items are mandatory. A National Insurance number may help with a search depending on the provider, but does not guarantee a policy will be found or replace identity verification.'
              )
            )
          ),
          h(
            'div',
            { className: 'checklist-stack' },
            STEP2_CHECKLIST_ITEMS.map(item => {
              const currentStatus = state.readinessStatus[item.id] || 'unsure';
              return h(
                'div',
                { key: item.id, className: 'status-selection-card' },
                h(
                  'div',
                  { className: 'status-card-header' },
                  h('h3', { className: 'status-card-title' }, item.title),
                  h('p', { className: 'status-card-desc' }, item.description),
                  item.hint && h('p', { style: { fontSize: '0.82rem', color: 'var(--muted)', margin: '4px 0 0', fontStyle: 'italic' } }, item.hint),
                  item.securityNote && h('span', { className: 'status-security-note' }, `Notice: ${item.securityNote}`)
                ),
                h(
                  'div',
                  { className: 'status-pill-group', role: 'radiogroup', 'aria-label': `Status for ${item.title}` },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: `status-pill-btn ${currentStatus === 'have' ? 'active' : ''}`,
                      'data-status': 'have',
                      onClick: () => handleSetStatus(item.id, 'have'),
                      role: 'radio',
                      'aria-checked': currentStatus === 'have',
                    },
                    '✓ I have this'
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: `status-pill-btn ${currentStatus === 'look' ? 'active' : ''}`,
                      'data-status': 'look',
                      onClick: () => handleSetStatus(item.id, 'look'),
                      role: 'radio',
                      'aria-checked': currentStatus === 'look',
                    },
                    '🔍 I need to look for it'
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: `status-pill-btn ${currentStatus === 'unsure' ? 'active' : ''}`,
                      'data-status': 'unsure',
                      onClick: () => handleSetStatus(item.id, 'unsure'),
                      role: 'radio',
                      'aria-checked': currentStatus === 'unsure',
                    },
                    '? I’m not sure'
                  )
                )
              );
            })
          ),
          // Nav Bar
          h(
            'div',
            { className: 'flow-navigation-bar' },
            h('div', { className: 'flow-nav-left' },
              h('button', {
                type: 'button',
                className: 'btn-flow-back',
                onClick: () => {
                  onUpdateState({ activeStep: 1 });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
              }, '← Back to Step 1')
            ),
            h('div', { className: 'flow-nav-right' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'btn-flow-next',
                  onClick: () => {
                    onUpdateState({ activeStep: 3 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                },
                h('span', null, 'Continue to Guidance'),
                h('span', { 'aria-hidden': 'true' }, ' →')
              )
            )
          )
        ),

      // STEP 3: GUIDANCE FOR YOUR SITUATION
      currentStep === 3 &&
        h(
          'div',
          { className: 'content-section-panel' },
          h('div', { className: 'section-number' }, 'STEP 3 OF 4 — GUIDANCE FOR YOUR SITUATION'),
          h('h2', { className: 'section-title', style: { marginBottom: '8px' } }, 'Tailored guidance for what you know'),
          h('p', { className: 'section-sub', style: { marginBottom: '24px' } }, 'Based on your selections, here are the most relevant investigation steps, official resources, and suggested questions to ask.'),
          h(
            'div',
            { className: 'guidance-stack' },
            activeBranches.map(branch => {
              return h(
                'div',
                { key: branch.id, className: 'guidance-branch-card' },
                h('span', { className: 'branch-badge' }, branch.badge),
                h('h3', null, branch.title),
                h('p', null, branch.summary),
                h(
                  'ul',
                  { style: { margin: '0 0 16px 20px', padding: 0, fontSize: '0.9rem', color: 'var(--ink)', lineHeight: '1.6' } },
                  branch.keyPoints.map((kp, idx) => h('li', { key: idx, style: { marginBottom: '6px' } }, kp))
                ),
                branch.officialLink &&
                  h(
                    'div',
                    { className: 'guidance-action-link-box' },
                    h('p', { style: { margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--muted)' } }, branch.officialLink.description),
                    h(
                      'a',
                      { href: branch.officialLink.url, target: '_blank', rel: 'noopener noreferrer' },
                      branch.officialLink.label,
                      h('span', { 'aria-hidden': 'true' }, ' ↗')
                    )
                  ),
                h(
                  'div',
                  { style: { marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '14px' } },
                  h('h4', { style: { fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' } }, 'Suggested questions for this situation (included in your plan):'),
                  branch.suggestedQuestions.map((q, idx) => {
                    const isChecked = state.selectedQuestionIds[q] !== false;
                    return h(
                      'label',
                      {
                        key: idx,
                        style: {
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 12px',
                          background: isChecked ? 'var(--paper)' : 'transparent',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-xs)',
                          marginBottom: '6px',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                        },
                      },
                      h('input', {
                        type: 'checkbox',
                        checked: isChecked,
                        onChange: () => handleToggleQuestion(q),
                        style: { marginTop: '3px' },
                      }),
                      h('span', { style: { color: 'var(--ink)', fontWeight: isChecked ? 600 : 400 } }, q)
                    );
                  })
                )
              );
            })
          ),
          // Nav Bar
          h(
            'div',
            { className: 'flow-navigation-bar' },
            h('div', { className: 'flow-nav-left' },
              h('button', {
                type: 'button',
                className: 'btn-flow-back',
                onClick: () => {
                  onUpdateState({ activeStep: 2 });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
              }, '← Back to Step 2')
            ),
            h('div', { className: 'flow-nav-right' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'btn-flow-next',
                  onClick: () => {
                    onUpdateState({ activeStep: 4 });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                },
                h('span', null, 'Generate my enquiry plan'),
                h('span', { 'aria-hidden': 'true' }, ' →')
              )
            )
          )
        ),

      // STEP 4: REVIEW AND PRINT (ENQUIRY PLAN)
      currentStep === 4 &&
        h(
          'div',
          { className: 'call-plan-layout-box' },
          // Print-only Header
          h(
            'div',
            { className: 'call-plan-print-banner', 'aria-hidden': 'true' },
            h('h1', null, 'PensionSteps — Old-Pension Enquiry Preparation Plan'),
            h('p', null, `Prepared on: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} | Independent Enquiry Worksheet`),
            h('p', null, 'Independent preparation tool. Does not search databases or provide financial advice.')
          ),
          // Screen Header
          h(
            'header',
            { className: 'call-plan-head-strip' },
            h('div', { className: 'section-number' }, 'STEP 4 OF 4 — YOUR ENQUIRY PLAN'),
            h('h2', { className: 'call-plan-main-title' }, 'Your Personalised Enquiry Plan'),
            h('p', { className: 'call-plan-lead-desc' },
              'Keep this plan beside you during your call, or use it when composing an email or postal enquiry to the scheme administrator.'
            ),
            h(
              'div',
              { className: 'call-plan-meta-strip no-print' },
              h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Checklist items: '), `${STEP2_CHECKLIST_ITEMS.length} organised`),
              h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Questions queued: '), `${selectedQuestions.length} selected`),
              h('div', { className: 'call-plan-meta-pill' }, h('strong', null, 'Privacy: '), 'In-memory browser session only')
            )
          ),

          // 1. Situation Summary
          h(
            'section',
            { className: 'plan-section' },
            h('h3', { className: 'plan-section-title' }, '1. Your Situation Summary'),
            h(
              'div',
              { className: 'situation-summary-list' },
              h('div', { className: 'situation-summary-item' },
                h('span', { className: 'situation-summary-label' }, 'Starting knowledge:'),
                h('span', { className: 'situation-summary-value' },
                  state.knownDetails.length > 0
                    ? state.knownDetails.map(id => {
                        const opt = STEP1_KNOWLEDGE_OPTIONS.find(o => o.id === id);
                        return opt ? opt.title : id;
                      }).join(' • ')
                    : 'Starting with very little (investigative route)'
                )
              ),
              h('div', { className: 'situation-summary-item' },
                h('span', { className: 'situation-summary-label' }, 'Policy reference:'),
                h('span', { className: 'situation-summary-value' },
                  isPolicyNumberKnown(state.knownDetails, state.readinessStatus)
                    ? 'Available on paper'
                    : 'Missing (to be requested via personal details)'
                )
              ),
              h('div', { className: 'situation-summary-item' },
                h('span', { className: 'situation-summary-label' }, 'Former employer / provider:'),
                h('span', { className: 'situation-summary-value' },
                  isProviderKnown(state.knownDetails, state.readinessStatus) && isEmployerKnown(state.knownDetails, state.readinessStatus)
                    ? 'Both known (Direct Provider contact with employer context)'
                    : isProviderKnown(state.knownDetails, state.readinessStatus)
                    ? 'Provider known (employer unconfirmed)'
                    : isEmployerKnown(state.knownDetails, state.readinessStatus)
                    ? 'Employer known (provider or scheme administrator to be traced)'
                    : 'Both unknown (career timeline trace & HMRC employment history)'
                )
              )
            )
          ),

          // 2. Information to have ready
          h(
            'section',
            { className: 'plan-section' },
            h('h3', { className: 'plan-section-title' }, '2. Information to have ready'),
            h('p', { style: { fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '12px' } },
              'Requirements vary. The organisation you contact will explain what information and verification it needs.'
            ),
            h(
              'table',
              { className: 'call-plan-status-table' },
              h('tbody', null,
                STEP2_CHECKLIST_ITEMS.map(item => {
                  const status = state.readinessStatus[item.id] || 'unsure';
                  const label = status === 'have'
                    ? 'I have this'
                    : status === 'look'
                    ? 'I need to look for it'
                    : 'I’m not sure';
                  const badgeStyle = status === 'have'
                    ? { color: 'var(--teal)', fontWeight: 'bold' }
                    : status === 'look'
                    ? { color: '#92400E', fontWeight: 'bold' }
                    : { color: 'var(--muted)' };
                  return h(
                    'tr',
                    { key: item.id },
                    h('td', { style: { width: '130px', ...badgeStyle } }, label),
                    h('td', null,
                      h('div', { style: { fontWeight: 600, color: 'var(--ink)' } }, item.title),
                      h('div', { style: { fontSize: '0.84rem', color: 'var(--muted)' } }, item.description)
                    )
                  );
                })
              )
            )
          ),

          // 3. Who you could contact next
          h(
            'section',
            { className: 'plan-section' },
            h('h3', { className: 'plan-section-title' }, '3. Who to contact next'),
            h(
              'div',
              { style: { background: 'var(--paper)', border: '1px solid var(--line)', padding: '16px 20px', borderRadius: 'var(--radius-xs)' } },
              isProviderKnown(state.knownDetails, state.readinessStatus) && isEmployerKnown(state.knownDetails, state.readinessStatus)
                ? h('div', null,
                    h('h4', { style: { fontSize: '1rem', color: 'var(--ink)', margin: '0 0 6px' } }, 'Direct Scheme Provider / Administrator (with Employer Context)'),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: 0 } },
                      'Contact the customer servicing department of the named pension provider. Provide your former employer name and employment dates to assist their search in matching you to the right historical group scheme.'
                    )
                  )
                : isProviderKnown(state.knownDetails, state.readinessStatus)
                ? h('div', null,
                    h('h4', { style: { fontSize: '1rem', color: 'var(--ink)', margin: '0 0 6px' } }, 'Direct Scheme Provider / Administrator'),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: 0 } },
                      'Contact the customer servicing department of the named pension provider. Ask for their historic policy search or trace team to look up your record using personal details.'
                    )
                  )
                : isEmployerKnown(state.knownDetails, state.readinessStatus)
                ? h('div', null,
                    h('h4', { style: { fontSize: '1rem', color: 'var(--ink)', margin: '0 0 6px' } }, 'Former Employer HR or Pension Tracing Service'),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px' } },
                      '1. If your former employer is still in business, contact their HR or pensions team for scheme administrator details.'
                    ),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: 0 } },
                      '2. If the company closed or merged, use the government’s free statutory database: ',
                      h('a', { href: 'https://www.gov.uk/find-pension-contact-details', target: '_blank', rel: 'noopener noreferrer' }, 'gov.uk/find-pension-contact-details')
                    )
                  )
                : h('div', null,
                    h('h4', { style: { fontSize: '1rem', color: 'var(--ink)', margin: '0 0 6px' } }, 'Checking Past Employment Records & Free Tracing Guidance'),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px' } },
                      'Reconstruct your employment timeline: check old P45/P60 certificates, payslips, or your online HMRC Personal Tax Account employment history.'
                    ),
                    h('p', { style: { fontSize: '0.9rem', color: 'var(--muted)', margin: 0 } },
                      'Review free independent tracing guidance at ',
                      h('a', { href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-problems/tracing-and-finding-lost-pensions', target: '_blank', rel: 'noopener noreferrer' }, 'moneyhelper.org.uk/tracing-and-finding-lost-pensions')
                    )
                  )
            )
          ),

          // 4. Questions to ask
          h(
            'section',
            { className: 'plan-section' },
            h('h3', { className: 'plan-section-title' }, '4. Questions to ask on your call'),
            h(
              'div',
              { className: 'questions-card-stack' },
              selectedQuestions.map((q, idx) => {
                return h(
                  'div',
                  { key: idx, className: 'question-card selected', style: { cursor: 'default' } },
                  h('div', { className: 'question-quote-text' }, `${idx + 1}. "${q}"`)
                );
              })
            )
          ),

          // 5. Blank spaces to record conversation
          h(
            'section',
            { className: 'plan-section' },
            h('h3', { className: 'plan-section-title' }, '5. Conversation Record & Next Actions'),
            h(
              'div',
              { className: 'worksheet-log-block' },
              h(
                'div',
                { className: 'call-log-fields-grid' },
                h('div', { className: 'call-log-field' },
                  h('span', { className: 'call-log-label' }, 'Date of contact'),
                  h('div', { className: 'worksheet-write-line' })
                ),
                h('div', { className: 'call-log-field' },
                  h('span', { className: 'call-log-label' }, 'Organisation or team contacted'),
                  h('div', { className: 'worksheet-write-line' })
                ),
                h('div', { className: 'call-log-field' },
                  h('span', { className: 'call-log-label' }, 'Enquiry reference given'),
                  h('div', { className: 'worksheet-write-line' })
                )
              ),
              h('div', { className: 'worksheet-write-row' },
                h('span', { className: 'worksheet-write-label' }, 'What they told you:'),
                h('div', { className: 'worksheet-write-box' })
              ),
              h('div', { className: 'worksheet-write-row' },
                h('span', { className: 'worksheet-write-label' }, 'Agreed next action & follow-up date:'),
                h('div', { className: 'worksheet-write-box', style: { minHeight: '50px' } })
              )
            )
          ),

          // Service Boundaries Reminder
          h(
            'div',
            { style: { background: 'var(--paper)', border: '1px solid var(--line)', padding: '14px 18px', borderRadius: 'var(--radius-xs)', fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '24px' } },
            h('strong', null, 'Important Reminder: '),
            'Requirements vary. The organisation you contact will explain what information and verification it needs. PensionSteps is an independent preparation tool. It does not provide financial advice, access pension accounts or submit requests to providers.'
          ),

          // Action buttons
          h(
            'div',
            { className: 'flow-navigation-bar no-print' },
            h('div', { className: 'flow-nav-left' },
              h('button', {
                type: 'button',
                className: 'btn-flow-back',
                onClick: () => {
                  onUpdateState({ activeStep: 3 });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
              }, '← Back to Step 3'),
              h('button', {
                type: 'button',
                className: 'btn-flow-back',
                onClick: () => {
                  onUpdateState({ activeStep: 1 });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
              }, '✎ Edit answers')
            ),
            h('div', { className: 'flow-nav-right' },
              h('button', {
                type: 'button',
                className: 'btn-flow-reset',
                onClick: onStartAgain,
              }, '↺ Start again'),
              h('button', {
                type: 'button',
                className: 'btn-print-action',
                onClick: () => window.print(),
              }, '⎙ Print my plan'),
              h('button', {
                type: 'button',
                className: 'btn-print-action',
                style: { backgroundColor: 'var(--ink)', borderColor: 'var(--ink)' },
                onClick: handleDownloadPdf,
              }, '📥 Download PDF plan')
            )
          )
        )
    )
  );
}

function AboutModal({ isOpen, onClose }) {
  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return h(
    'div',
    { className: 'modal-overlay', onClick: onClose, role: 'presentation' },
    h(
      'div',
      {
        className: 'modal-dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'about-dialog-heading',
        onClick: (e) => e.stopPropagation(),
      },
      h(
        'div',
        { className: 'modal-header' },
        h('h3', { id: 'about-dialog-heading', className: 'modal-title' }, 'About PensionSteps & Important Safeguards'),
        h('button', { type: 'button', className: 'modal-close-btn', onClick: onClose, 'aria-label': 'Close dialog' }, '×')
      ),
      h(
        'div',
        { className: 'modal-body' },
        h('p', null, h('strong', null, 'PensionSteps'), ' is an independent UK pension-enquiry preparation tool. It helps users organise information and prepare for administrative enquiries about old pensions when details are incomplete.'),
        h('h4', null, 'What PensionSteps Is Not'),
        h('p', null, 'PensionSteps is not a pension provider, financial adviser, account portal, or live account service. It cannot search records, locate pensions, submit requests, or update customer records with providers.'),
        h('h4', null, 'The Three Distinct Stages of an Old Pension Enquiry'),
        h('p', null, 'When tracing an old pension, keep three separate concepts distinct:'),
        h('ol', { style: { paddingLeft: '20px', lineHeight: '1.6', marginBottom: '14px' } },
          h('li', null, h('strong', null, '1. Identifying an organisation: '), 'Finding the contact details of the employer or scheme administrator.'),
          h('li', null, h('strong', null, '2. Asking for a search: '), 'Asking that organisation to search their archived records.'),
          h('li', null, h('strong', null, '3. Proving identity: '), 'Completing their statutory security and identity checks before any information can be released.')
        ),
        h('h4', null, 'Not Regulated Financial Advice'),
        h('p', null, 'PensionSteps provides administrative organisation checklists and suggested conversational wording. It does not provide regulated financial advice under the UK Financial Services and Markets Act 2000.'),
        h('h4', null, 'Requirements Vary'),
        h('p', null, 'All UK pension schemes operate under distinct trust deeds, scheme rules, and administrator procedures. Requirements must always be checked directly with your scheme administrator.'),
        h('h4', null, 'Zero Personal Data Collection'),
        h('p', null, 'This website does not collect or store personal identifiers, National Insurance numbers, policy numbers, or addresses. All selections remain in your browser’s temporary memory during your current visit and are cleared when you reset or start again.')
      ),
      h(
        'div',
        { className: 'modal-footer' },
        h('button', { type: 'button', className: 'btn btn-primary', onClick: onClose }, 'Close & Return')
      )
    )
  );
}

function Footer({ onAboutClick, onHowItWorksClick, onResourcesClick, onStartJourney }) {
  return h(
    'footer',
    { className: 'site-footer', role: 'contentinfo' },
    h(
      'div',
      { className: 'container' },
      h(
        'div',
        { className: 'footer-row' },
        h(
          'div',
          { className: 'footer-brand' },
          h(
            'div',
            { className: 'brand', style: { display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' } },
            h('span', { className: 'brand-mark', 'aria-hidden': 'true' }, 'p'),
            h('strong', { className: 'brand-name', style: { fontSize: '1.05rem', color: 'var(--ink)' } }, 'PensionSteps')
          ),
          h('p', { style: { fontSize: '0.85rem', color: 'var(--muted)', margin: 0 } },
            'An independent UK pension-enquiry preparation tool. Free to use • No account needed • Zero personal data stored'
          )
        ),
        h(
          'ul',
          { className: 'footer-nav-list' },
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onStartJourney }, 'Prepare my enquiry')),
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onHowItWorksClick }, 'How it works')),
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onAboutClick }, 'About & Safeguards')),
          h('li', null, h('button', { type: 'button', className: 'footer-nav-link', onClick: onResourcesClick }, 'Official resources'))
        )
      ),
      h(
        'div',
        { style: { borderTop: '1px solid var(--line)', paddingTop: '18px', marginTop: '16px' } },
        h('p', { className: 'footer-disclaimer-text' },
          'PensionSteps is an independent preparation tool. It does not provide financial advice, access pension accounts or submit requests to providers. Requirements vary; check directly with your provider.'
        )
      ),
      h(
        'div',
        { className: 'footer-bottom-bar', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--muted)' } },
        h('p', { style: { margin: 0 } }, `© ${new Date().getFullYear()} PensionSteps. Independent UK pension-enquiry preparation tool. Zero personal data collected.`),
        h('p', { style: { margin: 0 } }, 'Design inspired by Fieldnotes Student by Colorlib (CC BY 3.0).')
      )
    )
  );
}

// --- 5. Root App Component ---

function App() {
  const [isJourneyActive, setIsJourneyActive] = React.useState(false);
  const [journeyState, setJourneyState] = React.useState(createInitialJourneyState);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

  const handleStartJourney = () => {
    setIsJourneyActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setIsJourneyActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAgain = () => {
    setJourneyState(createInitialJourneyState());
    setIsJourneyActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateJourneyState = (updates) => {
    setJourneyState(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleScrollToHowItWorks = () => {
    if (isJourneyActive) {
      setIsJourneyActive(false);
      setTimeout(() => {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToResources = () => {
    if (isJourneyActive) {
      setIsJourneyActive(false);
      setTimeout(() => {
        document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return h(
    'div',
    { className: 'app-root' },
    h('a', { href: '#main-content', className: 'skip-link' }, 'Skip to main content'),
    h(Header, {
      onHomeClick: handleHomeClick,
      onAboutClick: () => setIsAboutOpen(true),
      onStartJourney: handleStartJourney,
      onHowItWorksClick: handleScrollToHowItWorks,
      onResourcesClick: handleScrollToResources,
    }),
    h(
      'main',
      { id: 'main-content', tabIndex: -1 },
      !isJourneyActive
        ? h(
            React.Fragment,
            null,
            h(Hero, {
              onStartJourney: handleStartJourney,
              onHowItWorksClick: handleScrollToHowItWorks,
            }),
            h(HowItWorksSection, {
              onStartJourney: handleStartJourney,
            }),
            h(SafeguardsSection, {
              onAboutClick: () => setIsAboutOpen(true),
            }),
            h(OfficialResourcesSection, null),
            h(FAQSection, null),
            h(CTACalloutSection, {
              onStartJourney: handleStartJourney,
            })
          )
        : h(GuidedJourneyFlow, {
            state: journeyState,
            onUpdateState: handleUpdateJourneyState,
            onHomeClick: handleHomeClick,
            onStartAgain: handleStartAgain,
          })
    ),
    h(Footer, {
      onAboutClick: () => setIsAboutOpen(true),
      onHowItWorksClick: handleScrollToHowItWorks,
      onResourcesClick: handleScrollToResources,
      onStartJourney: handleStartJourney,
    }),
    h(AboutModal, {
      isOpen: isAboutOpen,
      onClose: () => setIsAboutOpen(false),
    })
  );
}

// Mount runtime reliably
function mount() {
  rootElement = document.getElementById('root');
  rootComponentFn = App;
  performRender();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
