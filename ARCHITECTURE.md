# ARCHITECTURE.md — Cyber Safety Checker

## 1. Purpose

This document defines the architecture for the **Cyber Safety Checker** web application.

The application is a static, browser-based cybersecurity self-assessment tool. It will be hosted on **GitHub Pages** and built with **HTML, CSS, and vanilla JavaScript**.

The app does not require a backend, database, API, authentication system, package manager, or build process.

The application should be simple enough for GitHub Copilot to build faithfully and for a college student to understand and explain.

---

## 2. Architecture Overview

The application follows a simple client-side architecture:

```text
User
  |
  v
index.html
  |
  +---- style.css
  |
  +---- script.js
          |
          +---- Questionnaire data
          +---- UI state
          +---- Scoring logic
          +---- Recommendation logic
          +---- localStorage history
```

Everything runs inside the browser.

There is no server-side processing.

---

## 3. Technology Stack

Use:

- HTML5 for page structure
- CSS3 for layout, appearance, responsiveness, and visual states
- Vanilla JavaScript for application behavior
- Browser `localStorage` for saved results
- GitHub Pages for deployment

Do not add frameworks or libraries unless absolutely necessary.

Do not use:

- React
- Vue
- Angular
- Node.js backend code
- Express
- PHP
- Python backend code
- Databases
- Authentication systems
- External APIs
- Environment variables
- Build tools

The project should work immediately after cloning by opening `index.html`.

---

## 4. Project File Structure

Use the following structure:

```text
/
├── index.html
├── style.css
├── script.js
├── AGENTS.md
├── ARCHITECTURE.md
└── README.md
```

Do not create unnecessary folders.

If the project later needs assets, create:

```text
/assets/
```

Only use this folder if actual local image or icon files are needed.

Prefer simple Unicode characters, CSS, or inline SVG for decorative icons instead of extra dependencies.

---

## 5. Responsibilities by File

### index.html

Responsible for:

- Main page structure
- App sections
- Semantic HTML
- Buttons and form controls
- Accessibility labels
- Static privacy information
- Loading `style.css`
- Loading `script.js`

The HTML should define the major application views, but JavaScript may populate dynamic content such as questions, score values, recommendations, and history.

### style.css

Responsible for:

- Dark cybersecurity theme
- Responsive layout
- Typography
- Buttons
- Cards
- Progress indicator
- Score presentation
- Recommendation styling
- History styling
- Focus states
- Mobile behavior
- Accessible color contrast

Do not place application logic in CSS.

### script.js

Responsible for:

- Questionnaire data
- Current application state
- Starting the assessment
- Displaying questions
- Recording answers
- Navigating through questions
- Calculating the score
- Assigning the score category
- Generating recommendations
- Rendering results
- Saving history
- Loading history
- Clearing history
- Restarting the assessment
- Handling localStorage errors safely

---

## 6. Application Views

The app should behave like a small single-page application.

Do not use separate HTML pages.

Create four main visual sections:

```text
Welcome View
Questionnaire View
Results View
History View
```

JavaScript should show and hide the correct sections as the user moves through the app.

Suggested HTML structure:

```html
<main>
  <section id="welcome-view"></section>
  <section id="quiz-view" hidden></section>
  <section id="results-view" hidden></section>
  <section id="history-view"></section>
</main>
```

Use the HTML `hidden` attribute or clearly defined CSS classes to manage visibility.

Do not remove accessibility information just to visually hide content.

---

## 7. Application State

Keep the runtime state simple.

Suggested state variables:

```javascript
let currentQuestionIndex = 0;
let answers = [];
```

The questionnaire data should be stored separately.

Example structure:

```javascript
const questions = [
  {
    id: "unique-passwords",
    text: "Do you use a different password for important accounts?",
    recommendation:
      "Use unique passwords for important accounts to reduce the damage if one account is compromised."
  }
];
```

Do not save temporary questionnaire progress unless explicitly added later.

Only completed assessment results need to be stored.

---

## 8. Questionnaire Data Model

Each question should contain:

```text
id
text
recommendation
```

Optional fields may include:

```text
category
helpText
```

Use stable question IDs so recommendations do not depend on array position.

Example:

```javascript
{
  id: "mfa",
  text: "Do you have multi-factor authentication enabled on important accounts?",
  recommendation:
    "Turn on multi-factor authentication for important accounts whenever it is available."
}
```

The initial version should contain approximately 10 questions.

---

## 9. Answer Model

Each question has three possible answers:

```text
Yes
Sometimes
No
```

Represent answers internally with values that make scoring easy.

Recommended format:

```javascript
const answerValues = {
  yes: 10,
  sometimes: 5,
  no: 0
};
```

The saved answer for the active assessment may look like:

```javascript
{
  questionId: "mfa",
  value: "sometimes",
  points: 5
}
```

Do not save sensitive personal information.

---

## 10. Scoring Architecture

The assessment uses a maximum score of 100.

For 10 questions:

```text
Yes = 10 points
Sometimes = 5 points
No = 0 points
```

Calculate the score by adding all selected answer points.

To keep the architecture flexible if the number of questions changes, normalize the score instead of assuming there will always be exactly 10 questions.

Recommended formula:

```javascript
const earnedPoints = answers.reduce((total, answer) => total + answer.points, 0);
const maximumPoints = questions.length * 10;
const score = Math.round((earnedPoints / maximumPoints) * 100);
```

This guarantees a score from 0 to 100 even if more questions are added later.

---

## 11. Score Categories

Use one centralized function to determine the category.

Suggested function:

```javascript
function getScoreCategory(score) {
  if (score >= 80) {
    return {
      key: "strong",
      label: "Strong Cyber Safety",
      message:
        "Your cybersecurity habits are strong. Keep maintaining good security practices and continue reviewing your accounts and devices regularly."
    };
  }

  if (score >= 60) {
    return {
      key: "good",
      label: "Good, But Could Improve",
      message:
        "You already follow several good cybersecurity practices, but there are still areas where your online security could be strengthened."
    };
  }

  if (score >= 40) {
    return {
      key: "some-risk",
      label: "Some Security Risks",
      message:
        "Some of your online habits could expose you to unnecessary cybersecurity risks. Improving a few key practices could make a significant difference."
    };
  }

  return {
    key: "high-risk",
    label: "High Risk",
    message:
      "Several of your current online habits may increase your cybersecurity risk. Start with the recommendations below and improve your security one step at a time."
  };
}
```

Keep category labels and messages in one location to avoid duplicated logic.

---

## 12. Recommendation Architecture

Recommendations should be generated from answers marked:

```text
Sometimes
No
```

Use the recommendation already associated with each question.

Recommended logic:

```javascript
function generateRecommendations() {
  return answers
    .filter(answer => answer.value !== "yes")
    .map(answer => {
      const question = questions.find(
        item => item.id === answer.questionId
      );

      return question.recommendation;
    });
}
```

Do not show irrelevant recommendations.

If every answer is `Yes`, display a positive message such as:

```text
Great work. No major improvements were identified in this check.
```

---

## 13. Navigation Flow

The normal application flow is:

```text
Page loads
   |
   v
Welcome Screen
   |
   | Start Safety Check
   v
Question 1
   |
   v
Question 2
   |
   v
...
   |
   v
Final Question
   |
   v
Calculate Score
   |
   v
Generate Recommendations
   |
   v
Save Result
   |
   v
Results Screen
   |
   +---- Take Check Again
   |
   +---- View saved history
```

The user should not be able to accidentally submit an unanswered question.

A selected answer should be required before continuing.

---

## 14. Progress Indicator

Show the user's current position during the questionnaire.

Example:

```text
Question 3 of 10
```

Optionally include a progress bar.

Calculate progress using:

```javascript
const progress =
  ((currentQuestionIndex + 1) / questions.length) * 100;
```

Do not communicate progress using color alone.

Include visible text.

---

## 15. localStorage Architecture

Use browser `localStorage`.

Storage key:

```javascript
const STORAGE_KEY = "cyberSafetyCheckerHistory";
```

Store only completed assessment history.

Do not store:

- Passwords
- Email addresses
- Account usernames
- Authentication information
- Credit card information
- Social Security numbers
- Browser history
- Private messages
- Device scan information

---

## 16. Saved Result Data Model

Each completed assessment should be stored as an object.

Recommended format:

```javascript
{
  id: "generated-result-id",
  score: 85,
  category: "Strong Cyber Safety",
  categoryKey: "strong",
  recommendationCount: 2,
  completedAt: "2026-08-29T17:00:00.000Z"
}
```

The application does not need to save every individual questionnaire answer in history.

Saving only the summary reduces unnecessary stored information.

Store history as an array:

```javascript
[
  {
    id: "...",
    score: 85,
    category: "Strong Cyber Safety",
    categoryKey: "strong",
    recommendationCount: 2,
    completedAt: "..."
  }
]
```

---

## 17. Saving History

Use a dedicated function:

```javascript
function saveResult(result) {
  const history = loadHistory();
  history.unshift(result);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );
}
```

Newest results should appear first.

Optionally limit history to a reasonable amount such as 50 entries:

```javascript
const trimmedHistory = history.slice(0, 50);
```

This is optional but recommended.

---

## 18. Loading History

Use a safe parser.

Recommended architecture:

```javascript
function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load saved assessment history.", error);
    return [];
  }
}
```

The application must continue working if:

- localStorage is empty
- saved JSON is corrupted
- storage is unavailable
- an unexpected value exists

Do not allow storage errors to crash the assessment.

---

## 19. Clearing History

Provide a button labeled:

```text
Clear History
```

Before deleting data, ask the user for confirmation.

Example:

```javascript
const confirmed = window.confirm(
  "Are you sure you want to delete your saved Cyber Safety Checker history?"
);
```

If confirmed:

```javascript
localStorage.removeItem(STORAGE_KEY);
```

Then immediately update the history UI.

Do not reload the whole page unless necessary.

---

## 20. Result IDs

Each saved result should have a simple unique ID.

Preferred option:

```javascript
crypto.randomUUID()
```

If browser support is a concern, use a fallback based on date and random text.

Do not install a package just to generate IDs.

---

## 21. Date and Time Handling

Save timestamps using:

```javascript
new Date().toISOString()
```

Display timestamps using the browser's local date and time formatting.

Example:

```javascript
new Date(result.completedAt).toLocaleString()
```

This lets the browser display the time naturally for the user.

---

## 22. DOM Rendering Architecture

Use safe DOM APIs.

Preferred:

```javascript
document.createElement()
element.textContent = value
element.appendChild()
```

Avoid using `innerHTML` for dynamic user-controlled or stored content.

Static HTML templates may exist in `index.html`, but dynamic values should be inserted safely.

Cache frequently used DOM references near the beginning of `script.js`.

Example:

```javascript
const welcomeView = document.getElementById("welcome-view");
const quizView = document.getElementById("quiz-view");
const resultsView = document.getElementById("results-view");
```

---

## 23. Recommended JavaScript Functions

Use small, focused functions.

Recommended structure:

```javascript
initializeApp()
startAssessment()
showView()
renderQuestion()
selectAnswer()
goToNextQuestion()
calculateScore()
getScoreCategory()
generateRecommendations()
displayResults()
createResultRecord()
saveResult()
loadHistory()
renderHistory()
clearHistory()
restartAssessment()
updateProgress()
```

Avoid one very large function.

Functions should do one clear job.

---

## 24. Initialization

When the page loads:

```text
1. Cache DOM elements
2. Attach event listeners
3. Load history
4. Render history
5. Show welcome screen
```

Suggested entry point:

```javascript
document.addEventListener("DOMContentLoaded", initializeApp);
```

---

## 25. Event Handling

Use JavaScript event listeners.

Example:

```javascript
startButton.addEventListener("click", startAssessment);
```

Avoid inline event attributes such as:

```html
<button onclick="startAssessment()">
```

Keep behavior in `script.js`.

---

## 26. Restart Behavior

When the user selects **Take Check Again**:

Reset:

```text
currentQuestionIndex
answers
temporary selected answer
progress
```

Do not delete saved history.

Then display the first question.

---

## 27. Results View

The results screen should contain:

```text
Cyber Safety Score
Score category
Category explanation
Personalized recommendations
Take Check Again button
```

The score should be visually prominent.

Example:

```text
85 / 100
Strong Cyber Safety
```

Do not communicate results using color alone.

Always include text labels.

---

## 28. History View

Each history item should display:

```text
Score
Category
Date and time
Number of recommended improvements
```

Example:

```text
85 / 100
Strong Cyber Safety
August 29, 2026, 12:34 PM
2 suggested improvements
```

If there are no saved results, display:

```text
No previous Cyber Safety Checks yet.
```

Do not leave an empty container without explanation.

---

## 29. Visual Architecture

Use a centered main application container.

Suggested layout:

```text
body
  |
  +---- header
  |
  +---- main.app-container
  |       |
  |       +---- current app view
  |       |
  |       +---- history section
  |
  +---- footer / privacy information
```

Use CSS Grid or Flexbox where appropriate.

Keep the layout simple.

---

## 30. Theme

Use a professional cybersecurity-inspired dark theme.

Suggested CSS variables:

```css
:root {
  --background: #0b1020;
  --surface: #141b2d;
  --surface-secondary: #1c2538;
  --text-primary: #f4f7fb;
  --text-secondary: #b8c2d6;
  --accent: #39c6ff;
  --success: #42d392;
  --warning: #f6c85f;
  --danger: #ff6b6b;
  --border: #2c3952;
}
```

Exact colors may be adjusted to improve contrast.

Use CSS variables so theme values remain centralized.

---

## 31. Responsive Design

Use mobile-first CSS.

Recommended breakpoint:

```css
@media (min-width: 768px) {
  /* enhanced tablet/desktop layout */
}
```

The app should remain readable at approximately 320px wide.

Avoid fixed-width layouts.

Use:

```css
width: min(100% - 2rem, 800px);
```

or an equivalent responsive container.

---

## 32. Accessibility Architecture

Accessibility is part of the architecture, not a final add-on.

Use:

- `<main>`
- `<section>`
- `<h1>` through `<h3>` in logical order
- `<button>`
- `<fieldset>`
- `<legend>`
- `<label>`

For answer choices, radio buttons are recommended because the user selects one answer per question.

Example:

```html
<fieldset>
  <legend>Do you use multi-factor authentication?</legend>

  <label>
    <input type="radio" name="answer" value="yes">
    Yes
  </label>
</fieldset>
```

Make sure:

- All controls are keyboard usable.
- Focus styles are visible.
- Text contrast is strong.
- Buttons have descriptive labels.
- Score status is written in text.
- Progress is provided as text.
- Decorative icons are hidden from screen readers when appropriate.

---

## 33. Privacy Architecture

The app must clearly state:

```text
This tool does not scan your device or accounts.
Your answers are processed only in your browser.
Completed score history is stored locally in this browser.
The app does not collect passwords or send your assessment to a server.
```

This information should be easy to find.

The application should not make claims that it can detect malware, vulnerabilities, compromised accounts, or active attacks.

---

## 34. Security Design

Even though this is a static educational application, follow safe coding practices.

Use:

- `textContent` for dynamic text
- safe DOM creation
- fixed answer values
- defensive JSON parsing
- minimal data storage
- no unnecessary third-party scripts

Avoid:

- `eval()`
- `new Function()`
- unsafe dynamic HTML
- external tracking
- secret keys
- storing confidential information
- collecting unnecessary personal data

---

## 35. Error Handling

The app should fail gracefully.

Possible errors include:

```text
localStorage unavailable
invalid saved JSON
missing history
unexpected saved values
```

The assessment itself should remain functional even when saved history cannot be loaded or saved.

Log useful technical details with:

```javascript
console.error()
```

Do not display technical stack traces to users.

If saving fails, a small friendly message may be shown:

```text
Your score was calculated, but this browser could not save it to history.
```

---

## 36. No Backend Boundary

GitHub Copilot must not introduce server-side architecture.

Do not create:

```text
server.js
api/
database/
.env
package.json
authentication endpoints
```

unless the project requirements are explicitly changed later.

All core features must work entirely in the browser.

---

## 37. GitHub Pages Deployment Architecture

Use only relative references:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js" defer></script>
```

Do not use absolute repository paths such as:

```text
/my-repository/style.css
```

Relative paths ensure the project works when deployed under:

```text
username.github.io/repository-name/
```

The entry point must remain:

```text
index.html
```

---

## 38. Testing Strategy

Before considering the app complete, manually test:

### Questionnaire

- Start button works.
- First question displays.
- Each answer can be selected.
- User cannot advance without an answer.
- Progress updates correctly.
- All questions can be completed.

### Scoring

Test examples such as:

```text
All Yes -> 100
All Sometimes -> 50
All No -> 0
Mixed answers -> expected normalized score
```

### Categories

Verify boundaries:

```text
80 -> Strong Cyber Safety
79 -> Good, But Could Improve
60 -> Good, But Could Improve
59 -> Some Security Risks
40 -> Some Security Risks
39 -> High Risk
0 -> High Risk
```

### Recommendations

Verify:

- Yes answers do not create recommendations.
- Sometimes answers do create recommendations.
- No answers do create recommendations.
- Recommendation text matches the relevant question.

### localStorage

Verify:

- Completed result is saved.
- Refreshing preserves history.
- Multiple results appear newest first.
- Clear History removes results.
- Restart does not delete history.

### Responsive Behavior

Test:

- Mobile width
- Tablet width
- Desktop width
- No horizontal scrolling

### Accessibility

Test:

- Tab navigation
- Visible keyboard focus
- Radio controls have labels
- Buttons are reachable
- Text communicates score meaning without relying on color

---

## 39. Recommended Build Order for GitHub Copilot

Build the application in this order:

```text
Phase 1
Create index.html, style.css, and script.js.

Phase 2
Add the welcome screen and basic layout.

Phase 3
Create the questionnaire data.

Phase 4
Implement question rendering and answer selection.

Phase 5
Implement navigation and progress.

Phase 6
Implement score calculation.

Phase 7
Implement categories and personalized recommendations.

Phase 8
Create the results screen.

Phase 9
Implement localStorage saving and loading.

Phase 10
Create the history interface and Clear History feature.

Phase 11
Implement restart behavior.

Phase 12
Improve accessibility.

Phase 13
Add responsive cybersecurity-themed styling.

Phase 14
Test all scoring boundaries, browser storage, and mobile behavior.

Phase 15
Create or update README.md and verify GitHub Pages compatibility.
```

Do not skip directly to visual polish before the core workflow works.

---

## 40. Definition of Done

The architecture is correctly implemented when:

- `index.html` loads without a server.
- The welcome screen appears.
- The user can begin an assessment.
- Approximately 10 cybersecurity questions are displayed one at a time.
- Each question accepts Yes, Sometimes, or No.
- Progress is visible.
- The final score is normalized to 0–100.
- The correct score category is displayed.
- Recommendations are based on weaker answers.
- The completed result is saved to localStorage.
- Saved results survive browser refreshes.
- Previous results are displayed newest first.
- History can be cleared with confirmation.
- The assessment can be restarted without deleting history.
- No sensitive information is collected.
- No backend exists.
- The UI is responsive.
- The app is keyboard accessible.
- The project deploys successfully to GitHub Pages.
- The code remains simple, readable, and easy to explain.

---

## 41. Copilot Implementation Rule

GitHub Copilot should treat `AGENTS.md` as the source of project requirements and this `ARCHITECTURE.md` as the implementation blueprint.

If there is uncertainty:

1. Preserve the requirements in `AGENTS.md`.
2. Follow the simple browser-only architecture in this document.
3. Prefer the least complicated implementation that fully satisfies the requirements.
4. Do not introduce frameworks, services, APIs, or backend components without explicit instructions.
5. Keep the application understandable, maintainable, accessible, and compatible with GitHub Pages.
