# Cyber Safety Checker

Cyber Safety Checker is a simple educational web app that helps users review daily cybersecurity habits and get practical improvement tips.

## What the app does

- Runs a short cyber safety self-check directly in the browser
- Calculates a Cyber Safety Score from 0 to 100
- Shows a score category and plain-language explanation
- Generates personalized recommendations based on weaker answers
- Stores previous check summaries locally so users can review progress

## Main features

- Welcome screen with app overview and privacy reminder
- 10-question questionnaire with **Yes / Sometimes / No** answers
- Question progress indicator and progress bar
- Score categories:
  - 80–100: Strong Cyber Safety
  - 60–79: Good, But Could Improve
  - 40–59: Some Security Risks
  - 0–39: High Risk
- Recommendations only for questions answered **Sometimes** or **No**
- Saved result history (newest first)
- Clear history button with confirmation
- Take Check Again restart flow

## Technologies used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Browser storage behavior

- Completed results are saved under the `cyberSafetyCheckerHistory` localStorage key.
- Each saved result includes score, category, completion time, and recommendation count.
- The app does **not** store passwords, account credentials, or private messages.
- Clearing browser data may remove saved results.

## Run locally

1. Clone or download this repository.
2. Open `/home/runner/work/cyber-saftey-checker/cyber-saftey-checker/index.html` in a modern web browser.

No build steps, backend, or environment variables are required.

## Deploy on GitHub Pages

1. Push the repository to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. Set the source to your branch (for example `main`) and root (`/`).
4. Save, then open the published GitHub Pages URL.

The app is fully client-side and compatible with GitHub Pages.

## Important note

Cyber Safety Checker is an educational self-assessment tool. It does not perform a professional security audit and does not scan devices, accounts, or networks.