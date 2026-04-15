import { surveyQuestions } from "./surveyData";

export const learningStyleMeta = {
  visual: {
    key: "visual",
    label: "Görsel",
    icon: "👁️",
    color: "#a855f7",
    softColor: "rgba(168, 85, 247, 0.16)",
  },
  auditory: {
    key: "auditory",
    label: "İşitsel",
    icon: "🎧",
    color: "#06b6d4",
    softColor: "rgba(6, 182, 212, 0.16)",
  },
  readwrite: {
    key: "readwrite",
    label: "Okuma / Yazma",
    icon: "📝",
    color: "#6366f1",
    softColor: "rgba(99, 102, 241, 0.16)",
  },
  kinesthetic: {
    key: "kinesthetic",
    label: "Kinestetik",
    icon: "🤸",
    color: "#f97316",
    softColor: "rgba(249, 115, 22, 0.16)",
  },
};

export function createEmptyScores() {
  return {
    visual: 0,
    auditory: 0,
    readwrite: 0,
    kinesthetic: 0,
  };
}

export function calculateSurveyScores(answers) {
  const scores = createEmptyScores();

  for (const optionType of Object.values(answers || {})) {
    if (scores[optionType] !== undefined) {
      scores[optionType] += 1;
    }
  }

  return scores;
}

export function rankSurveyStyles(scores) {
  return Object.entries(scores)
    .map(([key, score]) => ({
      ...learningStyleMeta[key],
      score,
      percentage: Math.round((score / surveyQuestions.length) * 100),
    }))
    .sort((left, right) => right.score - left.score);
}

export function isSurveyComplete(answers) {
  return Object.keys(answers || {}).length === surveyQuestions.length;
}

export function getSurveyAnswerDetails(answers) {
  return surveyQuestions.flatMap((question) => {
    const selectedType = answers?.[question.id];
    const selectedOption = question.options.find((option) => option.type === selectedType);

    if (!selectedOption) {
      return [];
    }

    return [
      {
        questionId: question.id,
        question: question.text,
        answer: selectedOption.text,
        style: selectedOption.type,
        styleLabel: learningStyleMeta[selectedOption.type].label,
      },
    ];
  });
}

export function getBlendSummary(rankedStyles) {
  const [primary, secondary] = rankedStyles;

  if (!primary || primary.score === 0) {
    return "Tüm sorular tamamlandığında öğrenme profiliniz burada görünecek.";
  }

  if (secondary && primary.score - secondary.score <= 1) {
    return `${primary.label} ve ${secondary.label} eğilimleri birlikte öne çıkıyor. Hibrit bir öğrenme profiliniz var.`;
  }

  if (secondary && primary.score - secondary.score <= 3) {
    return `${primary.label} baskın görünüyor; ancak ${secondary.label} eğiliminiz de güçlü.`;
  }

  return `${primary.label} stiliniz belirgin biçimde öne çıkıyor.`;
}
