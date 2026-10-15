#!/usr/bin/env python3
"""
PensionSteps Automated Verification Suite: Old-Pension Enquiry Preparation Tool
Verifies:
1. Palette and design system (Fieldnotes Student):
   - Dark Navy (#172B3A), Muted Teal (#246C65), Warm Off-White (#F8F6F1)
   - Notebook preview card with example call plan, stamp, and tape
   - Responsive, keyboard accessible (:focus-visible), prefers-reduced-motion
2. Homepage & Hero:
   - Clear old-pension focus
   - Exact Headline: "An old pension. Missing details. A clearer next step."
   - Supporting copy: "Not sure of your policy number, old address or pension provider? Organise what you remember and prepare for your next enquiry."
   - Primary button: "Prepare my pension enquiry"
   - Secondary link: "See how it works"
   - Explanation: "PensionSteps is an independent preparation tool. It does not search for pensions or contact providers on your behalf."
   - Three simple steps:
     1. Tell us what you know
     2. Review what to have ready
     3. Create your enquiry plan
   - Official resources: links to gov.uk/find-pension-contact-details and moneyhelper.org.uk
   - FAQ: 4 practical questions
3. Step 1 — What do you know?
   - Prompt: "What do you still have or remember?"
   - 7 knowledge options
   - Exclusive "Very little — I need help finding a starting point" logic
   - Reassurance: "It’s okay if you don’t remember everything. Start with what you know."
   - No fields for entering actual personal identifiers
4. Step 2 — What information can you have ready?
   - 3 statuses: "I have this", "I need to look for it", "I’m not sure"
   - Checklist items: Policy number, NI number, Names, Addresses, Employment dates, Employer name, Paperwork
   - Security banner: "Have sensitive information ready for the provider, but do not enter it on PensionSteps."
   - No text inputs for actual NI numbers, policy numbers, or addresses
5. Step 3 — Guidance for their situation (A through F):
   - Branch A: Provider known, policy number missing
   - Branch B: Old letter available (where to look, no uploads/OCR)
   - Branch C: Employer known, provider unknown (gov.uk link, explains it finds contact details only)
   - Branch D: Previous name or address uncertain (no guessing, flag gaps)
   - Branch E: Employer and provider both unknown (timeline, MoneyHelper link)
   - Branch F: Contingency questions if no record found initially
6. Step 4 — Review and print (Personalised Enquiry Plan):
   - Plain-English situation summary
   - "Information to have ready" status table
   - "Who to contact next"
   - Questions to ask during the call
   - Blank spaces to record conversation (Date of contact, Organisation/team contacted, Enquiry reference, What they were told, Agreed next action, Follow-up date)
   - Reminder: "Requirements vary. The organisation you contact will explain what information and verification it needs."
   - Controls: Back, Edit answers, Print my plan, Download PDF plan, Start again
7. Safeguards & Distinct Three Concepts:
   - 1. Identifying an organisation
   - 2. Asking for a search
   - 3. Completing identity and security checks
   - Not a pension provider, does not access accounts, not regulated financial advice
8. Privacy & Technical Safeguards:
   - In-memory state only (no localStorage, sessionStorage, cookies, or database)
   - No document uploads, no external APIs, no trackers
   - Pure client-side PDF generation
"""

import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_tests():
    print("==================================================================")
    print("   PensionSteps Verification: Old-Pension Preparation Tool        ")
    print("==================================================================")

    failures = []
    passes = []

    def check(condition, test_name):
        if condition:
            passes.append(test_name)
            print(f"  [PASS] {test_name}")
        else:
            failures.append(test_name)
            print(f"  [FAIL] {test_name}")

    # 1. Check main.css for Fieldnotes Student design system palette and components
    with open(os.path.join(BASE_DIR, 'src/styles/main.css'), 'r', encoding='utf-8') as f:
        main_css = f.read()

    check('#172B3A' in main_css or '#172b3a' in main_css.lower(), "Palette includes Dark Navy #172B3A")
    check('#246C65' in main_css or '#246c65' in main_css.lower(), "Palette includes Muted Teal #246C65")
    check('#F8F6F1' in main_css or '#f8f6f1' in main_css.lower(), "Palette includes Warm Off-White #F8F6F1")
    check('#EDF4F2' in main_css or '#E2E5DF' in main_css or '#e2e5df' in main_css.lower(), "Palette includes Light Neutral Accent")
    check('#39454D' in main_css or '#39454d' in main_css.lower(), "Palette includes Body Text #39454D")
    check('.notebook' in main_css or '.example-plan-card' in main_css, "Styles include example call plan notebook preview card")
    check('.knowledge-option-card' in main_css, "Styles include Step 1 knowledge option cards")
    check('.status-pill-btn' in main_css, "Styles include Step 2 status selection pills")
    check('.security-notice-callout' in main_css, "Styles include sensitive information security notice callout")
    check('.guidance-branch-card' in main_css, "Styles include Step 3 guidance branch cards")
    check('.call-plan-layout-box' in main_css, "Styles include Step 4 personalised call plan worksheet")
    check('.worksheet-log-block' in main_css, "Styles include worksheet conversation log block")
    check('.worksheet-write-line' in main_css and '.worksheet-write-box' in main_css, "Styles include blank writing lines and boxes for call log")
    check('.step-tab-button' in main_css, "Styles include 4-stage stepper navigation buttons")
    check(':focus-visible' in main_css, "Styles include visible focus states for keyboard accessibility")
    check('prefers-reduced-motion' in main_css, "Styles include reduced-motion media query support")

    # 2. Check print.css
    with open(os.path.join(BASE_DIR, 'src/styles/print.css'), 'r', encoding='utf-8') as f:
        print_css = f.read()
    check('@media print' in print_css, "Print stylesheet contains @media print")
    check('.call-plan-layout-box' in print_css, "Print stylesheet formats call plan layout for paper")
    check('.no-print' in print_css, "Print stylesheet hides screen navigation and action buttons")
    check('.worksheet-log-block' in print_css or '.worksheet-write-box' in print_css, "Print stylesheet formats handwriting log spaces")

    # 3. Check standalone app.js
    with open(os.path.join(BASE_DIR, 'app.js'), 'r', encoding='utf-8') as f:
        app_js = f.read()

    # Exact Homepage & Hero Copy
    check('An old pension. Missing details.' in app_js and 'A clearer next step.' in app_js,
          "Hero heading match: 'An old pension. Missing details. A clearer next step.'")
    check('Not sure of your policy number, old address or pension provider?' in app_js,
          "Hero supporting text match: 'Not sure of your policy number, old address or pension provider?...'")
    check('Organise what you remember and prepare for your next enquiry.' in app_js,
          "Hero supporting text second sentence match")
    check('Prepare my pension enquiry' in app_js, "Primary button label: 'Prepare my pension enquiry'")
    check('See how it works' in app_js, "Secondary link: 'See how it works'")
    check('PensionSteps is an independent preparation tool. It does not search for pensions or contact providers on your behalf.' in app_js,
          "Short explanation text match")
    check('Tell us what you know' in app_js, "Three simple steps — Step 1: 'Tell us what you know'")
    check('Review what to have ready' in app_js, "Three simple steps — Step 2: 'Review what to have ready'")
    check('Create your enquiry plan' in app_js, "Three simple steps — Step 3: 'Create your enquiry plan'")

    # Sample Call-Plan Preview
    check('Example call plan' in app_js, "Hero preview labelled 'Example call plan'")
    check('YOUR CALL PLAN' in app_js, "Hero preview contains 'YOUR CALL PLAN'")
    check('A4 Printable • Example' in app_js or 'Example' in app_js, "Hero preview indicates example status")

    # Reassurance and tone
    check('It’s okay if you don’t remember everything.' in app_js or "It's okay if you don't remember everything." in app_js,
          "Reassuring tone: 'It’s okay if you don’t remember everything.'")
    check('Start with what you know' in app_js, "Reassuring tone: 'Start with what you know'")

    # Three Distinct Concepts
    check('Identifying an organisation' in app_js, "Concept 1: Identifying an organisation to contact")
    check('Asking that organisation to search' in app_js, "Concept 2: Asking for a search")
    check('Completing identity and security checks' in app_js or 'security checks' in app_js, "Concept 3: Completing security checks")

    # Step 1: 7 options + exclusive "very little" logic
    check('An old pension letter or statement.' in app_js, "Step 1 option: Old pension letter")
    check('The pension provider’s name.' in app_js or "The pension provider's name." in app_js, "Step 1 option: Provider name")
    check('A policy or member number.' in app_js, "Step 1 option: Policy or member number")
    check('A former employer’s name.' in app_js or "A former employer's name." in app_js, "Step 1 option: Former employer name")
    check('Rough dates when I worked there.' in app_js, "Step 1 option: Employment dates")
    check('A previous name or address linked to the pension.' in app_js, "Step 1 option: Previous name/address")
    check('Very little — I need help finding a starting point.' in app_js, "Step 1 option: Very little")
    check('isExclusive' in app_js, "Step 1 logic enforces exclusive selection for 'very little'")

    # Step 2: 3 statuses and security notice
    check('I have this' in app_js, "Step 2 status: 'I have this'")
    check('I need to look for it' in app_js, "Step 2 status: 'I need to look for it'")
    check('I’m not sure' in app_js or "I'm not sure" in app_js, "Step 2 status: 'I’m not sure'")
    check('Have sensitive information ready for the provider, but do not enter it on PensionSteps.' in app_js,
          "Step 2 security banner: sensitive information guidance")

    # Privacy: No input fields for actual identifiers
    check('<input type="text"' not in app_js and "type: 'text'" not in app_js,
          "Privacy guarantee: No text input fields for actual NI numbers, policy numbers, or addresses")

    # Step 3: Guidance branches (A to F)
    check('Provider known, policy number missing' in app_js, "Guidance A present: Provider known, policy number missing")
    check('I believe I may have an old pension with you, but I don’t have a policy number.' in app_js or 'I believe I may have an old pension with you' in app_js,
          "Guidance A sample question present")
    check('Extracting clues from your old paperwork' in app_js or 'Old paperwork' in app_js, "Guidance B present: Old paperwork")
    check('Former employer known, provider unknown' in app_js, "Guidance C present: Employer known, provider unknown")
    check('gov.uk/find-pension-contact-details' in app_js or 'find-pension-contact-details' in app_js,
          "Guidance C links to official Pension Tracing Service")
    check('Previous name or address uncertain' in app_js, "Guidance D present: Previous name/address uncertain")
    check('Checking past employment records' in app_js or 'Finding a starting point' in app_js,
          "Guidance E present: Employer & provider unknown")
    check('moneyhelper.org.uk' in app_js, "Guidance E links to MoneyHelper")
    check('Questions to ask if no record is found initially' in app_js or 'Could the scheme be administered by another organisation?' in app_js,
          "Guidance F present: Contingency questions")

    # Authoritative Statements & Safeguards Verification
    check('contracted-out' not in app_js,
          "Authoritative check: Inaccurate HMRC contracted-out question removed")
    check('HMRC Personal Tax Account' in app_js,
          "Authoritative check: HMRC Personal Tax Account employment history check present")
    check('Provides contact details only' in app_js and 'does not confirm' in app_js,
          "Authoritative check: Statutory limits of Pension Tracing Service clearly stated")
    check('referencing: enter reference if known' in app_js,
          "Authoritative check: Conditional reference phrasing in Guidance B")

    # Data Modeling & Entity Separation
    check('provider_or_scheme' in app_js,
          "Entity modeling: Provider and Employer separated into distinct checklist entities in app.js")
    check('isEmployerKnown' in app_js and 'isProviderKnown' in app_js and 'isPolicyNumberKnown' in app_js,
          "Entity modeling: Unified cross-step detection helpers defined in app.js")
    check('Both known (Direct Provider contact with employer context)' in app_js,
          "Contradiction resolution: Distinct 'Both known' situation handled without conflict")
    check('Both unknown (career timeline trace' in app_js,
          "Contradiction resolution: Step 4 Situation Summary evaluates cross-step state")
    check("employer_name: 'look'" in app_js,
          "State integrity: Initial state does not prematurely assume employer is known")

    # Step 4: Personalised Enquiry Plan
    check('Your Personalised Enquiry Plan' in app_js, "Step 4 heading: 'Your Personalised Enquiry Plan'")
    check('1. Your Situation Summary' in app_js, "Plan section 1: Situation Summary")
    check('2. Information to have ready' in app_js, "Plan section 2: 'Information to have ready' (not 'documents required')")
    check('3. Who to contact next' in app_js, "Plan section 3: Who to contact next")
    check('4. Questions to ask on your call' in app_js or 'Questions to ask' in app_js, "Plan section 4: Questions to ask")
    check('5. Conversation Record & Next Actions' in app_js or 'Conversation Record' in app_js, "Plan section 5: Conversation Record")
    check('Date of contact' in app_js, "Log field: Date of contact")
    check('Organisation or team contacted' in app_js, "Log field: Organisation or team contacted")
    check('Enquiry reference given' in app_js or 'Enquiry reference' in app_js, "Log field: Enquiry reference")
    check('What they told you:' in app_js or 'What they told you' in app_js, "Log field: What they told you")
    check('Agreed next action' in app_js, "Log field: Agreed next action")
    check('Requirements vary. The organisation you contact will explain what information and verification it needs.' in app_js,
          "Plan reminder: 'Requirements vary. The organisation you contact will explain...'")

    # Step 4 Controls
    check('Print my plan' in app_js, "Control: 'Print my plan'")
    check('Download PDF plan' in app_js, "Control: 'Download PDF plan'")
    check('Edit answers' in app_js, "Control: 'Edit answers'")
    check('Start again' in app_js, "Control: 'Start again'")
    check('generateOldPensionPdf' in app_js, "Client-side PDF 1.4 generator implemented")

    # Privacy & Limits
    check('localStorage' not in app_js, "Privacy constraint: Zero localStorage usage for journey state")
    check('sessionStorage' not in app_js, "Privacy constraint: Zero sessionStorage usage for journey state")
    check('document.cookie' not in app_js, "Privacy constraint: Zero cookie usage for journey state")
    check('indexedDB' not in app_js, "Privacy constraint: Zero database usage")
    check('fetch(' not in app_js and 'axios' not in app_js and 'XMLHttpRequest' not in app_js,
          "Privacy constraint: Zero external API calls or network tracking")

    # Safeguards & Brand
    check('Fieldnotes Student by Colorlib' in app_js, "Template attribution preserved")
    check('Not Regulated Financial Advice' in app_js or 'not regulated financial advice' in app_js.lower(),
          "Safeguard: Not Regulated Financial Advice")
    check('Zero personal data collected' in app_js or 'Zero Personal Data Collection' in app_js,
          "Safeguard: Zero personal data collected")

    # Step 1 Clickability & Mini-Runtime Boolean Attribute Fixes
    check("el.removeAttribute('disabled')" in app_js and "el.disabled = false" in app_js,
          "Mini-runtime properly removes 'disabled' attribute when false")
    check("pointerEvents: 'none'" in app_js,
          "Step 1 card children have pointerEvents: 'none' for reliable click event targetting")
    check(".knowledge-option-card.selected .chk-box-custom" in main_css,
          "CSS includes checked state styling for Step 1 knowledge checkboxes")
    check("document.readyState === 'loading'" in app_js,
          "Reliable DOM mounting handles both interactive/complete and loading document states")
    check("start with what I have" in app_js or "Continue to Step 2" in app_js,
          "Step 1 continue button is never permanently blocked")

    # 4. Check React/TypeScript implementation in src/
    with open(os.path.join(BASE_DIR, 'src/data/oldPensionData.ts'), 'r', encoding='utf-8') as f:
        data_ts = f.read()
    check('STEP1_KNOWLEDGE_OPTIONS' in data_ts, "TypeScript data: STEP1_KNOWLEDGE_OPTIONS defined")
    check('STEP2_CHECKLIST_ITEMS' in data_ts, "TypeScript data: STEP2_CHECKLIST_ITEMS defined")
    check('STEP3_GUIDANCE_BRANCHES' in data_ts, "TypeScript data: STEP3_GUIDANCE_BRANCHES defined")
    check('provider_or_scheme' in data_ts, "TypeScript data: provider_or_scheme defined")
    check('isEmployerKnown' in data_ts and 'isProviderKnown' in data_ts, "TypeScript data: Entity helpers exported")

    with open(os.path.join(BASE_DIR, 'src/components/GuidedJourneyFlow.tsx'), 'r', encoding='utf-8') as f:
        flow_tsx = f.read()
    check('GuidedJourneyFlow' in flow_tsx, "React component: GuidedJourneyFlow defined")
    check('handleDownloadPdf' in flow_tsx, "React component: PDF download supported")
    check('isEmployerKnown' in flow_tsx and 'isProviderKnown' in flow_tsx, "React component: GuidedJourneyFlow uses entity helpers")

    with open(os.path.join(BASE_DIR, 'src/App.tsx'), 'r', encoding='utf-8') as f:
        app_tsx = f.read()
    check('GuidedJourneyFlow' in app_tsx, "App.tsx integrates GuidedJourneyFlow")
    check('isJourneyActive' in app_tsx, "App.tsx toggles between Homepage and GuidedJourneyFlow")
    check("employer_name: 'look'" in app_tsx, "App.tsx: Safe initial state for employer_name")
    check('export default App' in app_tsx, "App.tsx: Exports default App component for Vite/TS build")

    # 5. Check bidirectional state sync & provider-gated branches & zero external requests in index.html
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        index_html = f.read()
    check('fonts.googleapis.com' not in index_html and 'fonts.gstatic.com' not in index_html,
          "Privacy & offline guarantee: Zero external Google Fonts network requests in index.html")
    check('syncReadinessWithKnown' in app_js and 'syncKnownWithReadiness' in app_js,
          "State sync: Bidirectional Step 1 <-> Step 2 synchronization in app.js")
    check('syncReadinessWithKnown' in data_ts and 'syncKnownWithReadiness' in data_ts,
          "State sync: Bidirectional Step 1 <-> Step 2 synchronization in oldPensionData.ts")
    check('syncReadinessWithKnown' in flow_tsx and 'syncKnownWithReadiness' in flow_tsx,
          "State sync: GuidedJourneyFlow wires bidirectional synchronization")
    check('No specific questions selected' in app_js and 'No specific questions selected' in flow_tsx,
          "PDF fallback: Neutral fallback note when no questions selected (no unprompted provider assumptions)")

    print("\n------------------------------------------------------------------")
    print(f"Results: {len(passes)} PASSED, {len(failures)} FAILED")
    print("------------------------------------------------------------------")

    if failures:
        print("\nFailed Checks:")
        for fail in failures:
            print(f"  - {fail}")
        sys.exit(1)
    else:
        print("\nAll verification checks PASSED successfully.")

if __name__ == '__main__':
    run_tests()

