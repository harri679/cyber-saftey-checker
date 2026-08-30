const STORAGE_KEY = "cyberSafetyCheckerHistory";
const QUESTIONS = [
  {
    id: "unique-passwords",
    text: "Do you use a different password for important accounts?",
    recommendation: "Use unique passwords for important accounts."
  },
  {
    id: "strong-passwords",
    text: "Do you use long and strong passwords?",
    recommendation: "Create longer passwords or passphrases."
  },
  {
    id: "password-manager",
    text: "Do you use a password manager?",
    recommendation: "Consider using a reputable password manager."
  },
  {
    id: "mfa",
    text: "Do you have multi-factor authentication enabled?",
    recommendation: "Turn on multi-factor authentication whenever possible."
  },
  {
    id: "updates",
    text: "Do you regularly install software and security updates?",
    recommendation: "Keep your operating system, browser, and applications updated."
  },
  {
    id: "check-links",
    text: "Do you check links before clicking them?",
    recommendation: "Avoid clicking unexpected links without checking them first."
  },
  {
    id: "unexpected-messages",
    text: "Are you careful with unexpected emails, messages, or attachments?",
    recommendation: "Be cautious with unexpected attachments and messages."
  },
  {
    id: "public-wifi",
    text: "Do you avoid entering sensitive information while using public Wi-Fi?",
    recommendation: "Avoid accessing sensitive accounts over unsecured public Wi-Fi."
  },
  {
    id: "backup-files",
    text: "Do you regularly back up important files?",
    recommendation: "Back up important files regularly."
  },
  {
    id: "security-settings",
    text: "Do you review privacy and security settings on your accounts?",
    recommendation: "Review privacy and security settings on important accounts."
  }
];

const ANSWER_VALUES = {
  yes: 10,
  sometimes: 5,
  no: 0
};

let currentQuestionIndex = 0;
let answers = [];

let welcomeView;
let quizView;
let resultsView;
let progressText;
let progressFill;
let progressBar;
let questionLegend;
let questionForm;
let questionError;
let scoreValue;
let scoreCategory;
let scoreMessage;
let recommendationsList;
let historyList;
let clearHistoryButton;
let storageStatus;

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  cacheDomElements();
  attachEventListeners();
  renderHistory();
  showView("welcome");
}

function cacheDomElements() {
  welcomeView = document.getElementById("welcome-view");
  quizView = document.getElementById("quiz-view");
  resultsView = document.getElementById("results-view");
  progressText = document.getElementById("progress-text");
  progressFill = document.getElementById("progress-fill");
  progressBar = document.querySelector(".progress-bar");
  questionLegend = document.getElementById("question-legend");
  questionForm = document.getElementById("question-form");
  questionError = document.getElementById("question-error");
  scoreValue = document.getElementById("score-value");
  scoreCategory = document.getElementById("score-category");
  scoreMessage = document.getElementById("score-message");
  recommendationsList = document.getElementById("recommendations-list");
  historyList = document.getElementById("history-list");
  clearHistoryButton = document.getElementById("clear-history-button");
  storageStatus = document.getElementById("storage-status");
}

function attachEventListeners() {
  document.getElementById("start-button").addEventListener("click", startAssessment);
  document.getElementById("restart-button").addEventListener("click", restartAssessment);
  clearHistoryButton.addEventListener("click", clearHistory);
  questionForm.addEventListener("submit", handleNextQuestion);
}

function showView(viewName) {
  welcomeView.hidden = viewName !== "welcome";
  quizView.hidden = viewName !== "quiz";
  resultsView.hidden = viewName !== "results";
}

function startAssessment() {
  currentQuestionIndex = 0;
  answers = [];
  storageStatus.textContent = "";
  showView("quiz");
  showQuestion();
}

function showQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  questionLegend.textContent = question.text;
  questionError.textContent = "";
  updateProgress();

  const selectedAnswer = answers[currentQuestionIndex]?.value;
  const answerInputs = questionForm.querySelectorAll('input[name="answer"]');
  answerInputs.forEach((input) => {
    input.checked = input.value === selectedAnswer;
  });
}

function updateProgress() {
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = QUESTIONS.length;
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

  progressText.textContent = `Question ${questionNumber} of ${totalQuestions}`;
  progressFill.style.width = `${progressPercent}%`;
  progressBar.setAttribute("aria-valuemax", String(totalQuestions));
  progressBar.setAttribute("aria-valuenow", String(questionNumber));
}

function selectAnswer() {
  const selectedInput = questionForm.querySelector('input[name="answer"]:checked');
  if (!selectedInput) {
    return false;
  }

  answers[currentQuestionIndex] = {
    questionId: QUESTIONS[currentQuestionIndex].id,
    value: selectedInput.value,
    points: ANSWER_VALUES[selectedInput.value]
  };

  return true;
}

function handleNextQuestion(event) {
  event.preventDefault();

  if (!selectAnswer()) {
    questionError.textContent = "Please choose Yes, Sometimes, or No before continuing.";
    return;
  }

  if (currentQuestionIndex < QUESTIONS.length - 1) {
    currentQuestionIndex += 1;
    showQuestion();
    return;
  }

  finishAssessment();
}

function finishAssessment() {
  const score = calculateScore();
  const category = getScoreCategory(score);
  const recommendations = generateRecommendations();

  displayResults(score, category, recommendations);

  const resultRecord = createResultRecord(score, category, recommendations.length);
  const saved = saveResult(resultRecord);
  if (!saved) {
    storageStatus.textContent =
      "Your score was calculated, but this browser could not save it to history.";
  }

  renderHistory();
  showView("results");
}

function calculateScore() {
  const earnedPoints = answers.reduce((total, answer) => total + answer.points, 0);
  const maximumPoints = QUESTIONS.length * 10;
  return Math.round((earnedPoints / maximumPoints) * 100);
}

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

function generateRecommendations() {
  return answers
    .filter((answer) => answer.value !== "yes")
    .map((answer) => {
      const question = QUESTIONS.find((item) => item.id === answer.questionId);
      return question?.recommendation;
    })
    .filter(Boolean);
}

function displayResults(score, category, recommendations) {
  scoreValue.textContent = `${score} / 100`;
  scoreCategory.textContent = category.label;
  scoreCategory.className = `score-category ${category.key}`;
  scoreMessage.textContent = category.message;

  recommendationsList.textContent = "";
  if (recommendations.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "Great work. No major improvements were identified in this check.";
    recommendationsList.appendChild(listItem);
    return;
  }

  recommendations.forEach((recommendation) => {
    const listItem = document.createElement("li");
    listItem.textContent = recommendation;
    recommendationsList.appendChild(listItem);
  });
}

function createResultRecord(score, category, recommendationCount) {
  return {
    id: generateResultId(),
    score,
    category: category.label,
    categoryKey: category.key,
    recommendationCount,
    completedAt: new Date().toISOString()
  };
}

function generateResultId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function saveResult(result) {
  try {
    const history = loadHistory();
    history.unshift(result);
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error("Unable to save assessment result.", error);
    return false;
  }
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidHistoryItem);
  } catch (error) {
    console.error("Unable to load saved assessment history.", error);
    return [];
  }
}

function isValidHistoryItem(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.score === "number" &&
    typeof item.category === "string" &&
    typeof item.categoryKey === "string" &&
    typeof item.recommendationCount === "number" &&
    typeof item.completedAt === "string"
  );
}

function renderHistory() {
  const history = loadHistory();
  historyList.textContent = "";

  if (history.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No previous Cyber Safety Checks yet.";
    historyList.appendChild(emptyMessage);
    clearHistoryButton.disabled = true;
    return;
  }

  clearHistoryButton.disabled = false;

  history.forEach((result) => {
    const item = document.createElement("article");
    item.className = "history-item";

    const score = document.createElement("p");
    score.textContent = `${result.score} / 100`;

    const category = document.createElement("p");
    category.textContent = result.category;

    const date = document.createElement("p");
    date.textContent = formatDate(result.completedAt);

    const improvements = document.createElement("p");
    improvements.textContent =
      result.recommendationCount === 1
        ? "1 suggested improvement"
        : `${result.recommendationCount} suggested improvements`;

    item.appendChild(score);
    item.appendChild(category);
    item.appendChild(date);
    item.appendChild(improvements);
    historyList.appendChild(item);
  });
}

function formatDate(dateValue) {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }
  return parsedDate.toLocaleString();
}

function clearHistory() {
  const confirmed = window.confirm(
    "Are you sure you want to delete your saved Cyber Safety Checker history?"
  );

  if (!confirmed) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear saved assessment history.", error);
  }

  renderHistory();
}

function restartAssessment() {
  startAssessment();
}
