# AGENTS.md — Cyber Safety Checker

## Project Overview

Build a simple, beginner-friendly web application called **Cyber Safety Checker**.

The purpose of the app is to help users evaluate their everyday cybersecurity habits and learn ways to improve their online safety.

The application will be hosted using **GitHub Pages**, so it must be a completely static website that runs entirely in the browser.

The app should save the user's information and previous results locally in the browser using **localStorage**. Do not require a database, server, login system, API key, or backend.

## Technology Requirements

Use only technologies that work directly with GitHub Pages:

- HTML5
- CSS3
- Vanilla JavaScript

Do not use:

- Node.js servers
- PHP
- Python backends
- Databases
- Paid APIs
- API keys
- Authentication systems
- Server-side code

The finished project should work by opening `index.html` and should deploy correctly through GitHub Pages.

## Main App Goal

Create an interactive cybersecurity safety assessment.

Users should answer questions about their online habits. The application will calculate a **Cyber Safety Score from 0–100** and provide personalized recommendations based on their answers.

The application is educational and should not claim to perform an actual security scan of the user's computer, accounts, network, or devices.

Clearly explain that the score is based only on the answers provided by the user.

## Main Features

### 1. Welcome Screen

Display:

- App name: **Cyber Safety Checker**
- Short explanation of what the app does
- A **Start Safety Check** button
- A privacy message explaining that answers stay in the user's browser

Example description:

> Find out how strong your everyday cybersecurity habits are. Answer a few questions and receive your personal Cyber Safety Score and recommendations.

### 2. Cyber Safety Questionnaire

Ask approximately 10 questions.

Questions should cover important cybersecurity behaviors such as:

1. Do you use a different password for important accounts?
2. Do you use long and strong passwords?
3. Do you use a password manager?
4. Do you have multi-factor authentication enabled?
5. Do you regularly install software and security updates?
6. Do you check links before clicking them?
7. Are you careful with unexpected emails, messages, or attachments?
8. Do you avoid entering sensitive information while using public Wi-Fi?
9. Do you regularly back up important files?
10. Do you review privacy and security settings on your accounts?

Use simple answer choices such as:

- Yes
- Sometimes
- No

Each answer should contribute points toward the user's score.

Example scoring:

- Yes = 10 points
- Sometimes = 5 points
- No = 0 points

The final result should be converted to a score between **0 and 100**.

### 3. Cyber Safety Score

After the questionnaire is completed, display the user's score prominently.

Use categories such as:

#### 80–100 — Strong Cyber Safety

Your cybersecurity habits are strong. Keep maintaining good security practices and continue reviewing your accounts and devices regularly.

#### 60–79 — Good, But Could Improve

You already follow several good cybersecurity practices, but there are still areas where your online security could be strengthened.

#### 40–59 — Some Security Risks

Some of your online habits could expose you to unnecessary cybersecurity risks. Improving a few key practices could make a significant difference.

#### 0–39 — High Risk

Several of your current online habits may increase your cybersecurity risk. Start with the recommendations below and improve your security one step at a time.

Do not use language intended to frighten the user.

### 4. Personalized Recommendations

Generate recommendations based on the questions where the user selected **No** or **Sometimes**.

Possible recommendations include:

- Use unique passwords for important accounts.
- Create longer passwords or passphrases.
- Consider using a reputable password manager.
- Turn on multi-factor authentication whenever possible.
- Keep your operating system, browser, and applications updated.
- Avoid clicking unexpected links without checking them first.
- Be cautious with unexpected attachments and messages.
- Avoid accessing sensitive accounts over unsecured public Wi-Fi.
- Back up important files regularly.
- Review privacy and security settings on important accounts.

Only show recommendations relevant to the user's answers.

### 5. Results History

Save completed safety checks using `localStorage`.

Each saved result should include:

- Cyber Safety Score
- Score category
- Date and time
- Number of recommended improvements

Create a **Previous Results** or **History** section where users can see earlier scores.

Show newest results first.

Do not store passwords, account credentials, email addresses, private messages, browsing history, or other sensitive information.

### 6. Browser Storage

Use `localStorage` for browser persistence.

Suggested storage key:

`cyberSafetyCheckerHistory`

The application should:

- Save a result after the user completes the questionnaire
- Load previous results when the page opens
- Continue working after the browser is refreshed
- Allow users to delete their saved history

Add a **Clear History** button.

Ask for confirmation before deleting saved history.

### 7. Restart Assessment

Include a button such as:

**Take Check Again**

This should reset the questionnaire while keeping previous results saved in history.

### 8. Privacy Information

Include a small privacy section.

Explain:

- The application does not scan the user's computer.
- The application does not collect passwords.
- The application does not send questionnaire responses to a server.
- Results are stored locally using the browser's localStorage.
- Clearing browser data may remove saved results.

## Design Requirements

Create a clean, modern cybersecurity-themed interface.

Use a dark theme with colors such as:

- Dark navy or black background
- Blue or cyan highlights
- White/light text
- Green for strong results
- Yellow/orange for medium results
- Red only when necessary for lower scores

The website should look professional rather than overly flashy.

Possible visual elements:

- Shield icon
- Lock icon
- Security score circle
- Progress bar
- Question progress indicator

Do not rely on images for important functionality.

## Responsive Design

The app must work well on:

- Desktop computers
- Laptops
- Tablets
- Smartphones

Use responsive CSS.

Avoid horizontal scrolling.

Buttons should be large enough to easily tap on mobile devices.

## Accessibility

Follow basic accessibility practices.

Requirements:

- Use semantic HTML.
- Associate labels with form controls.
- Make the website keyboard accessible.
- Maintain strong text/background contrast.
- Include visible focus states.
- Do not communicate score status using color alone.
- Use readable font sizes.
- Use buttons instead of clickable `<div>` elements.
- Add ARIA attributes only when they meaningfully improve accessibility.

## Suggested File Structure

```text
/
├── index.html
├── style.css
├── script.js
├── AGENTS.md
└── README.md
```

Keep the project simple unless additional files are clearly necessary.

## JavaScript Behavior

Organize JavaScript into understandable functions.

Suggested functions include:

```javascript
startAssessment()
showQuestion()
selectAnswer()
calculateScore()
generateRecommendations()
displayResults()
saveResult()
loadHistory()
renderHistory()
clearHistory()
restartAssessment()
```

Function names may change if a clearer structure is appropriate.

Avoid unnecessary complexity.

## Code Quality

GitHub Copilot should:

- Write clean and readable code.
- Use descriptive variable and function names.
- Add useful comments where logic may not be obvious.
- Avoid unnecessary frameworks or dependencies.
- Avoid duplicated code.
- Separate HTML structure, CSS styling, and JavaScript behavior.
- Test for missing or corrupted localStorage data.
- Keep the app usable even if no history exists.

## Security Requirements

Because this is a cybersecurity education application, follow secure coding practices.

Do not:

- Request real passwords.
- Store passwords.
- Request credit card information.
- Request Social Security numbers.
- Ask for authentication tokens.
- Collect unnecessary personal information.
- Insert user input using unsafe `innerHTML` when safer DOM methods can be used.
- Add hidden tracking.
- Add analytics without explicit instructions.

Prefer `textContent`, safe DOM creation methods, and validated values.

The application is an educational checker, not a vulnerability scanner.

## GitHub Pages Compatibility

The final project must work on GitHub Pages.

Requirements:

- Use relative file paths.
- Do not depend on server-side routing.
- Do not require environment variables.
- Do not require build commands.
- Do not require a backend.
- Make `index.html` the entry page.

The app should function correctly when hosted at a GitHub Pages repository URL such as:

`username.github.io/repository-name/`

## README.md

Also create a simple `README.md` explaining:

- What Cyber Safety Checker is
- What the app does
- Main features
- Technologies used
- How browser storage works
- How to run the project locally
- How to deploy it with GitHub Pages
- That it is an educational tool and not a professional security audit

## Completion Criteria

The project is complete when:

- The user can start the Cyber Safety Checker.
- All cybersecurity questions can be answered.
- Progress through the assessment is clearly displayed.
- A score between 0 and 100 is calculated correctly.
- A score category is displayed.
- Personalized recommendations appear.
- Results are saved to localStorage.
- Previous results remain after refreshing the browser.
- Users can view previous results.
- Users can clear saved history.
- Users can retake the assessment.
- The website works on mobile and desktop.
- The app works when deployed to GitHub Pages.
- No backend or external database is required.
- No sensitive user information is collected.

## Instructions for GitHub Copilot

When implementing this project, begin by creating the basic working version before adding visual enhancements.

Prioritize functionality in this order:

1. Build the HTML interface.
2. Create the questionnaire data and navigation.
3. Implement the scoring system.
4. Generate personalized recommendations.
5. Implement localStorage.
6. Add history and clear-history functionality.
7. Add responsive styling.
8. Improve accessibility.
9. Test all functionality.
10. Polish the visual design.

Do not over-engineer the project. Keep the code understandable for a college student who may need to explain how it works.

When uncertain between a complicated solution and a simple solution that satisfies the requirements, choose the simple solution.
