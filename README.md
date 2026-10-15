# PensionSteps — Old-Pension Enquiry Preparation Tool

> **An old pension. Missing details. A clearer next step.**  
> Not sure of your policy number, old address or pension provider? Organise what you remember and prepare for your next enquiry.

---

## 🎯 Project Purpose

PensionSteps helps people prepare to contact a pension provider about an old pension when they have incomplete information.

**Typical user situation:**
> *"I think I had a pension 20 years ago, but I don’t have the policy number, don’t remember my old address, and may not remember the employer or pension provider."*

### What PensionSteps Does:
1. **Identifies what you already know** (paperwork, employer names, approximate dates, old addresses, or starting with very little).
2. **Organises what information you can have ready** on your desk before dialling.
3. **Provides tailored guidance** and questions for the appropriate organisation.
4. **Generates a clear, printable A4 enquiry plan** with dedicated note-taking space.
5. **Records next actions** and follow-up dates after your call.

### What PensionSteps Does NOT Do:
- Search pension-provider records or locate pensions.
- Access pension accounts or verify entitlements.
- Submit enquiries or update customer records with providers.
- Provide regulated financial advice.
- Guarantee that any identifier will locate a policy.

---

## 🏛️ Design System & Visual Hierarchy

Inspired by the clean editorial style of **Fieldnotes Student**:
- **Warm-White Background** (`#F8F6F1`): Calm, tactile canvas.
- **Dark Navy Headings** (`#172B3A`): Legible, authoritative typography (Inter sans-serif with Georgia italic accents on `<em>`).
- **Muted Teal Actions** (`#246C65`): Focused, accessible interactive triggers.
- **Pale Paper Accent** (`#EDF4F2` / `#E2E5DF`): Subtle card backgrounds and status tags.
- **Sample Call Plan Preview**: Desktop hero notebook card with realistic example sections and circular stamp.
- **A4 Print Layout**: Dedicated print stylesheet hides navigation and action chrome, ensuring tidy pagination and ample space for handwriting call notes.

---

## 🧭 Four-Step Guided Enquiry Flow

1. **Step 1 — What do you know?**:
   - 7 knowledge options (old letter, provider name, policy number, former employer, employment dates, previous name/address, or very little).
   - Exclusive "Very little — I need help finding a starting point" logic.
   - Reassuring guidance: *"It’s okay if you don’t remember everything. Start with what you know."*

2. **Step 2 — What information can you have ready?**:
   - Status indicators: `I have this`, `I need to look for it`, `I’m not sure`.
   - Security Notice: *"Have sensitive information ready for the provider, but do not enter it on PensionSteps."*
   - Strictly no text fields for entering actual NI numbers, policy numbers, or full addresses.

3. **Step 3 — Guidance for your situation**:
   - **Branch A**: Provider known, policy number missing.
   - **Branch B**: Extracting clues from old paperwork.
   - **Branch C**: Former employer known, provider unknown (links to `gov.uk/find-pension-contact-details`).
   - **Branch D**: Previous name or address uncertain (transparency over guessing).
   - **Branch E**: Finding a starting point when both are unknown (links to `moneyhelper.org.uk`).
   - **Branch F**: Contingency questions if no record is found initially.

4. **Step 4 — Review & Print Your Plan**:
   - Situation summary and status checklist.
   - Who to contact next.
   - Selected questions to ask on your call.
   - Handwriting spaces for call date, organisation contacted, reference number, advice given, and agreed next action.
   - Options to **Print my plan** or **Download PDF plan** (client-side PDF 1.4 generator).
   - Full state reset on **Start again**.

---

## 🔒 Privacy & Safeguards

- **In-Memory Session Only**: Zero `localStorage`, `sessionStorage`, cookies, or database storage.
- **No Document Uploads**: No OCR, file processing, or server uploads.
- **Zero Third-Party Integrations**: No analytics, external trackers, or AI API requests.
- **Three Distinct Concepts**:
  1. *Identifying an organisation to contact.*
  2. *Asking that organisation to search archived records.*
  3. *Completing statutory identity and security checks.*

---

## 🚀 Running Locally

### Option 1: Zero-Build Static Server (Python 3)
Because `index.html`, `app.js`, and `src/styles/*.css` are self-contained, you can serve the project directly without Node.js installed:

```bash
cd pension-steps
./serve.sh
```
Or double-click **`start.command`** in macOS Finder, then open **http://localhost:8080** in your browser.

### Option 2: Vite Development Server (Node.js 20+)
If you have Node.js installed locally:

```bash
npm install
npm run dev
```

---

## 🧪 Running the Automated Test & Benchmark Suites

Run the automated verification suite (115 assertions) and synthetic capacity/state-space benchmark (10,000 simulated journeys + 1,728 exhaustive state permutations):

```bash
python3 tests/test_pensionsteps.py
python3 tests/test_capacity_benchmark.py
```
Or via npm:
```bash
npm test
```

---

## 🏗️ Building for Production

With Node.js 20+ installed:

```bash
npm run build
npm run preview
```
This runs TypeScript type-checking (`tsc`), builds the static production bundle with relative asset paths (`base: './'`) into `./dist`, and copies `app.js` into `./dist/app.js`.

---

## 🌐 Publishing to GitHub Pages

This repository includes an official GitHub Actions deployment workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Initial Setup
1. Push this repository to your GitHub remote on the `main` branch:
   ```bash
   git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The **Deploy PensionSteps to GitHub Pages** workflow will automatically run the Python verification suites, compile and bundle the site into `./dist`, and publish it to your GitHub Pages URL (`https://<username>.github.io/<repo-name>/`).

---

## 🔄 Updating the Live Site

Whenever you make changes to the project:
1. Run the verification suite locally:
   ```bash
   python3 tests/test_pensionsteps.py
   ```
2. Commit and push your changes to `main`:
   ```bash
   git add .
   git commit -m "Describe your update"
   git push origin main
   ```
3. GitHub Actions will automatically test, build, and redeploy the updated site within ~1 minute. You can also trigger a manual redeploy at any time from the **Actions** tab using **Run workflow**.

