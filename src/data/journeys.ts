import { JourneyData } from '../types';

export const JOURNEYS: JourneyData[] = [
  {
    id: 'old-pension-letter',
    cardTitle: '1. I received a letter about an old pension.',
    cardSummary: 'Understand why the letter was sent, verify the sender before replying, and prepare clear questions for the scheme provider.',
    tagline: 'Reviewing correspondence about an historic pension scheme',
    overview: 'Letters regarding older workplace or personal pensions often arrive following an administration review, scheme merger, change of administrator, or regulatory trace. Receiving correspondence does not automatically confirm you have an unclaimed fund or guaranteed entitlement. Before replying or disclosing personal identifiers, establish who sent the letter, why it was issued, and what records they hold.',
    regulatoryNotice: 'Important: Receiving correspondence does not confirm entitlement or the value of any pension. Always independently verify the sender’s official contact details using public registers or original scheme documentation before sharing personal details.',
    situationQuestions: [
      {
        id: 'opl-sq1',
        prompt: 'Do you recognise the employer or scheme administrator named on the letter?',
        options: [
          {
            value: 'recognise-yes',
            label: 'Yes, I recognise the employer or scheme provider',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1a',
                label: 'Note down your approximate dates of joining and leaving that employer',
                hint: 'Having your employment years ready helps administrators match archived personnel records quickly.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'recognise-no',
            label: 'No, I do not recognise this company or provider',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1b',
                label: 'Search the Pensions Regulator or Companies House for company history',
                hint: 'Check whether this company acquired or merged with an earlier company you worked for.',
                importance: 'essential',
                source: 'tailored',
              },
              {
                id: 'opl-tc-1c',
                label: 'Verify sender authorisation on the FCA Financial Services Register before calling',
                hint: 'Confirm the company is authorised before sharing any personal or pension details.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'recognise-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-1d',
                label: 'Check old CVs, P60 certificates, or historic bank records for company names',
                hint: 'Cross-referencing past tax years can help identify whether this was a workplace pension provider.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'opl-sq2',
        prompt: 'Is there an account, scheme, or member reference number on the correspondence?',
        options: [
          {
            value: 'ref-yes',
            label: 'Yes, a reference number is printed on the letter',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2a',
                label: 'Keep the letter and reference number directly in front of you',
                hint: 'Quote this exact reference number when you speak to the administrator to locate your file immediately.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'ref-no',
            label: 'No, I cannot see a reference number',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2b',
                label: 'Gather your National Insurance number and date of birth for identity tracing',
                hint: 'Without a scheme reference, administrators must search their master records by personal identifiers.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'ref-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-2c',
                label: 'Check the header and top-right margins for alphanumeric codes',
                hint: 'Member references often appear near the date or in the letter’s subject line.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'opl-sq3',
        prompt: 'Does the letter request a specific response or state a deadline date?',
        options: [
          {
            value: 'action-yes',
            label: 'Yes, it asks me to respond or return documents',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3a',
                label: 'Highlight the response deadline and list any requested forms',
                hint: 'Establish whether the administrator requires an address confirmation form, ID proof, or retirement decision.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'action-no',
            label: 'No, it appears to be an informational update or annual statement',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3b',
                label: 'File the statement safely and ask if ongoing contact is needed',
                hint: 'Informational statements usually require no action unless your personal details have changed.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'action-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'opl-tc-3c',
                label: 'Read the final paragraph or ‘Next Steps’ callout on the letter',
                hint: 'Check whether the letter asks for your confirmation or is just notifying you of scheme changes.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'opl-b1',
        label: 'Locate the full name of the sender and any named pension scheme',
        hint: 'Check whether the letter references a former employer, a specific pension trust, or a third-party administration bureau.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'opl-b2',
        label: 'Establish sender legitimacy before replying',
        hint: 'Cross-check the organisation name on the FCA Financial Services Register or The Pensions Regulator website rather than unverified search ads.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'opl-b3',
        label: 'Identify the specific stated purpose of the correspondence',
        hint: 'Determine whether the letter is an informational statement, an address-tracing exercise, or a request for documentation.',
        importance: 'recommended',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'opl-q1',
        question: '“Which specific pension scheme or employer does this correspondence relate to?”',
        context: 'Clarifies whether this covers a defined benefit (final salary) scheme, defined contribution scheme, or an historic group policy.',
        tag: 'Scheme Identity',
      },
      {
        id: 'opl-q2',
        question: '“Why was this letter issued at this time, and what action, if any, is required from me?”',
        context: 'Separates routine administrative housekeeping or address tracing from time-sensitive scheme decisions.',
        tag: 'Purpose & Action',
      },
      {
        id: 'opl-q3',
        question: '“Do your records show an active or deferred pension entitlement for me, or is this an exploratory trace?”',
        context: 'Crucial for establishing whether a verified benefit actually exists under your record.',
        tag: 'Entitlement Verification',
      },
      {
        id: 'opl-q4',
        question: '“What identity checks or reference details do you require before discussing account specifics?”',
        context: 'Allows you to prepare the exact security questions they use without volunteering unnecessary sensitive information up front.',
        tag: 'Security & Access',
      },
      {
        id: 'opl-q5',
        question: '“Can you issue an official, up-to-date summary statement by post to my verified address?”',
        context: 'Provides written confirmation for your personal records rather than relying solely on telephone notes.',
        tag: 'Written Documentation',
      },
    ],
    providerOnlyItems: [
      {
        id: 'opl-po1',
        title: 'Actual benefit entitlement and scheme value',
        detail: 'Only the scheme administrator can confirm whether benefits remain payable, whether a refund was taken in the past, or what transfer/retirement value exists.',
      },
      {
        id: 'opl-po2',
        title: 'Applicable scheme rules and retirement age',
        detail: 'Normal pension age, early retirement options, death benefits, and any guaranteed annuity rates are governed solely by that specific scheme’s legal trust deed.',
      },
      {
        id: 'opl-po3',
        title: 'Official security verification requirements',
        detail: 'The provider must verify your identity according to their own anti-fraud protocols before they can disclose financial data.',
      },
    ],
  },
  {
    id: 'address-update',
    cardTitle: '2. I want to update my address.',
    cardSummary: 'Prepare to ask your provider how they receive address updates, what evidence they require, and how changes are confirmed.',
    tagline: 'Maintaining accurate contact records across your pension providers',
    overview: 'Keeping your contact details current ensures you receive annual benefit statements, regulatory notices, and retirement option packs. This website is an independent customer-preparation tool and does not connect to or update any provider’s database. Providers have strict fraud-prevention procedures for address changes to protect pension assets against identity theft.',
    regulatoryNotice: 'Important: This website cannot access or modify your pension records. You must contact your pension provider directly through their verified channels to submit address changes.',
    situationQuestions: [
      {
        id: 'addr-sq1',
        prompt: 'Are you currently paying into this pension, or is it a past pension pot?',
        options: [
          {
            value: 'status-active',
            label: 'Currently paying into it (Active workplace pension)',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1a',
                label: 'Check whether your employer’s HR or payroll team updates the provider automatically',
                hint: 'Many workplace schemes receive address updates through company payroll rather than direct member calls.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'status-deferred',
            label: 'Past pension (Deferred / Frozen / Personal policy)',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1b',
                label: 'Note down the name of the employer linked to this scheme and the year you left',
                hint: 'Providers handling older deferred pots use employment departure dates for secondary security checks.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'status-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-1c',
                label: 'Ask the provider whether your plan is currently active or deferred',
                hint: 'This determines whether address changes must be submitted via your employer or directly to the provider.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'addr-sq2',
        prompt: 'Do you have more than one pension plan or pot with this provider?',
        options: [
          {
            value: 'pots-multiple',
            label: 'Yes, I hold multiple policies or plans with them',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2a',
                label: 'Prepare to ask the provider to apply the address update across ALL linked policies',
                hint: 'Updating one policy number does not always update linked AVCs, preserved pots, or group policies.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'pots-single',
            label: 'Just one single policy',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2b',
                label: 'Have your single policy or plan number to hand',
                hint: 'Have your latest policy statement or annual summary available for reference.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'pots-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-2c',
                label: 'Ask the administrator to search for any other historic policies linked to your details',
                hint: 'Ensure no older preserved pots remain registered under your old address.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'addr-sq3',
        prompt: 'Do you have recent proof of your new address (e.g. utility bill or council tax letter)?',
        options: [
          {
            value: 'proof-yes',
            label: 'Yes, I have an official document dated within the last 3 months',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3a',
                label: 'Keep a clean copy of your recent utility bill or bank statement ready',
                hint: 'Check whether the provider accepts digital uploads, PDF emails, or certified postal paper copies.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'proof-no',
            label: 'Not yet / Recently moved',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3b',
                label: 'Ask the provider what evidence they require if formal bills have not yet arrived',
                hint: 'Inquire whether a tenancy agreement, solicitor completion letter, or driving licence is accepted.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'proof-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'addr-tc-3c',
                label: 'Ask whether they can update verbal security over the phone or require physical proof',
                hint: 'Some providers update standard addresses via phone security questions; others mandate documentary proof.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'addr-b1',
        label: 'Locate your existing policy, scheme, or member reference number',
        hint: 'Find an old annual benefit statement, welcome pack, or payslip showing your scheme reference.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'addr-b2',
        label: 'Write down your exact old address as recorded on past statements',
        hint: 'Providers will ask for your previous address as part of anti-fraud identity verification before updating records.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'addr-b3',
        label: 'Prepare your full new postal address including postcode',
        hint: 'Ensure you have the exact Royal Mail format postcode to prevent delayed correspondence.',
        importance: 'essential',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'addr-q1',
        question: '“What is your official process for updating a member’s address on this scheme?”',
        context: 'Find out whether changes can be completed over the phone, via an online member portal, or require a signed paper form.',
        tag: 'Submission Process',
      },
      {
        id: 'addr-q2',
        question: '“Do you require documentary evidence of my new address, and what formats are accepted?”',
        context: 'Clarifies whether you need to send certified copies of utility bills, council tax statements, or driving licences.',
        tag: 'Verification Requirements',
      },
      {
        id: 'addr-q3',
        question: '“How will you confirm that the address change has been successfully processed?”',
        context: 'Establishes whether written confirmation is posted to the old address, new address, or sent by secure email.',
        tag: 'Confirmation Mechanism',
      },
      {
        id: 'addr-q4',
        question: '“Will this update automatically apply to all pension policies or funds I hold with your organisation?”',
        context: 'Prevents situation where one plan is updated but another historic policy remains under your old address.',
        tag: 'Scope of Update',
      },
      {
        id: 'addr-q5',
        question: '“Can you issue my next annual statement to this new address once the update is complete?”',
        context: 'Ensures your updated records are actively linked to regular statutory communications.',
        tag: 'Future Statements',
      },
    ],
    providerOnlyItems: [
      {
        id: 'addr-po1',
        title: 'Updating the live scheme database',
        detail: 'Only your pension provider’s administration team can alter account records, contact information, and postal destinations.',
      },
      {
        id: 'addr-po2',
        title: 'Deciding acceptable forms of identity verification',
        detail: 'Each provider sets their own risk-based anti-money laundering and address-verification standards in accordance with UK regulations.',
      },
      {
        id: 'addr-po3',
        title: 'Issuing official confirmation letters',
        detail: 'Confirmation notices and amended account documentation can only be generated and issued by the provider’s authorised systems.',
      },
    ],
  },
  {
    id: 'third-party-help',
    cardTitle: '3. I want someone to help with my pension enquiries.',
    cardSummary: 'Understand provider authorisation processes, identify required permissions, and establish the scope of representative support.',
    tagline: 'Navigating third-party authorisation and representative boundaries',
    overview: 'Under UK data protection laws, pension administrators cannot discuss personal details with a relative, friend, or advocate without explicit member consent. Authorisation mechanisms range from single-call verbal permission to formal third-party mandates and registered Powers of Attorney. General authority typically permits information gathering only, not financial transactions.',
    regulatoryNotice: 'Important: General third-party authority does not permit representative financial decision-making or fund withdrawals, and is not a substitute for a registered Lasting Power of Attorney (LPA).',
    situationQuestions: [
      {
        id: 'tph-sq1',
        prompt: 'What level of assistance is needed?',
        options: [
          {
            value: 'help-verbal',
            label: 'Speaking on the phone on the member’s behalf during a single call',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1a',
                label: 'Ensure the member is present at the start of the call to pass security',
                hint: 'The member can answer initial security checks and grant verbal consent for the helper to speak.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'help-ongoing',
            label: 'Managing correspondence and plan administration ongoing',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1b',
                label: 'Request the provider’s formal Letter of Authority or Third-Party Mandate form',
                hint: 'Ask what specific authority scope they recognize and how long the mandate remains valid.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'help-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-1c',
                label: 'Ask the provider what forms of third-party authority they support',
                hint: 'Clarify whether telephone verbal authority is sufficient or if written authority is required.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'tph-sq2',
        prompt: 'Is there an officially registered Lasting Power of Attorney (LPA) in place?',
        options: [
          {
            value: 'lpa-yes',
            label: 'Yes, an LPA for Property and Financial Affairs is registered',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2a',
                label: 'Obtain an Office of the Public Guardian (OPG) digital share code or certified copy',
                hint: 'Most modern UK pension providers verify LPAs digitally via GOV.UK using an OPG access code.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'lpa-no',
            label: 'No registered Power of Attorney',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2b',
                label: 'Remember: general authority only permits enquiries, not withdrawals or transfers',
                hint: 'Without an LPA, helpers cannot instruct payment withdrawals, investment changes, or scheme transfers.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'lpa-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-2c',
                label: 'Confirm whether any existing mandate covers Property and Financial Affairs',
                hint: 'Health and Welfare LPAs do not grant authority to manage pensions or financial matters.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
      {
        id: 'tph-sq3',
        prompt: 'Will the pension account holder be able to join the phone call?',
        options: [
          {
            value: 'member-present',
            label: 'Yes, the member will be beside the phone',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3a',
                label: 'Brief the member on the questions before calling so they can give consent comfortably',
                hint: 'The call handler will ask the member to state their name and confirm permission for you to speak.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'member-unable',
            label: 'No, the member cannot be on the phone call',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3b',
                label: 'Ensure formal third-party authority is on file with the provider before ringing',
                hint: 'Without the member present or formal paperwork logged, call handlers cannot disclose account information.',
                importance: 'essential',
                source: 'tailored',
              },
            ],
          },
          {
            value: 'member-unsure',
            label: 'I’m not sure',
            tailoredChecklistItems: [
              {
                id: 'tph-tc-3c',
                label: 'Ask what communication adjustments the provider offers for vulnerable or unwell members',
                hint: 'Many providers have dedicated vulnerable-customer teams and accessible communication arrangements.',
                importance: 'recommended',
                source: 'tailored',
              },
            ],
          },
        ],
      },
    ],
    baselineChecklist: [
      {
        id: 'tph-b1',
        label: 'Identify the exact scope of help required',
        hint: 'Decide whether you only need help making a one-off phone enquiry or ongoing management of incoming correspondence.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'tph-b2',
        label: 'Prepare the scheme member’s verification details',
        hint: 'Have the member’s full legal name, date of birth, current address, and scheme reference ready.',
        importance: 'essential',
        source: 'baseline',
      },
      {
        id: 'tph-b3',
        label: 'Have the representative’s identification details ready',
        hint: 'Providers will take the representative’s full name, address, relationship to the member, and contact telephone number.',
        importance: 'recommended',
        source: 'baseline',
      },
    ],
    suggestedQuestions: [
      {
        id: 'tph-q1',
        question: '“What is your procedure for logging third-party authority on this account?”',
        context: 'Determines whether verbal consent during the call is adequate or if a formal written mandate form must be completed.',
        tag: 'Authorisation Process',
      },
      {
        id: 'tph-q2',
        question: '“Can the member give verbal authority on this call for me to speak on their behalf?”',
        context: 'Allows immediate assistance on standard queries if the member is present to pass initial security checks.',
        tag: 'Verbal Consent',
      },
      {
        id: 'tph-q3',
        question: '“What specific actions does this third-party authority permit or restrict?”',
        context: 'Clarifies boundaries: usually permits receiving statements and asking administrative questions, but forbids withdrawals.',
        tag: 'Scope & Limits',
      },
      {
        id: 'tph-q4',
        question: '“How long does this third-party authority remain valid on your records?”',
        context: 'Identifies whether permission expires after the single call, after 12 months, or remains indefinitely until revoked.',
        tag: 'Validity Duration',
      },
      {
        id: 'tph-q5',
        question: '“What documentation is required if managing affairs under a Power of Attorney?”',
        context: 'Ensures attorneys provide the exact registration format needed (such as an OPG digital share code or certified copy).',
        tag: 'Power of Attorney',
      },
    ],
    providerOnlyItems: [
      {
        id: 'tph-po1',
        title: 'Validation and recording of third-party mandates',
        detail: 'Only the provider’s legal compliance team can approve third-party representation and log the authorized representative on your file.',
      },
      {
        id: 'tph-po2',
        title: 'Acceptance criteria for Powers of Attorney',
        detail: 'Providers verify donor and attorney identity, check OPG digital access codes, and ensure the LPA is registered for Property and Financial Affairs.',
      },
      {
        id: 'tph-po3',
        title: 'Scheme-specific restrictions on representative instructions',
        detail: 'Certain trust-based schemes prohibit representatives from executing particular scheme options without direct member countersignature.',
      },
    ],
  },
];
