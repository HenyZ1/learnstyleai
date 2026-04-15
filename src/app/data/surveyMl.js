import { learningStyleMeta } from "./surveyUtils";
import surveyMlWeights from "./surveyMlWeights";

function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exponentials = logits.map((logit) => Math.exp(logit - maxLogit));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

function getAmbiguityLevel(confidence, margin) {
  if (confidence < 0.52 || margin < 0.08) {
    return "Yüksek";
  }

  if (confidence < 0.7 || margin < 0.16) {
    return "Orta";
  }

  return "Düşük";
}

export function predictSurveyProfileML(answers) {
  const { classes, weights, biases, validAccuracy, testAccuracy, holdoutAccuracy, syntheticTestAccuracy } =
    surveyMlWeights;
  const logits = biases.slice();

  Object.entries(answers || {}).forEach(([questionId, selectedStyle]) => {
    const questionOffset = (Number(questionId) - 1) * classes.length;
    const classIndex = classes.indexOf(selectedStyle);

    if (questionOffset < 0 || classIndex < 0) {
      return;
    }

    const featureIndex = questionOffset + classIndex;

    for (let index = 0; index < classes.length; index += 1) {
      logits[index] += weights[index][featureIndex];
    }
  });

  const probabilities = softmax(logits);
  const rankedProbabilities = classes
    .map((key, index) => ({
      key,
      label: learningStyleMeta[key].label,
      icon: learningStyleMeta[key].icon,
      color: learningStyleMeta[key].color,
      probability: probabilities[index],
      percent: Math.round(probabilities[index] * 100),
    }))
    .sort((left, right) => right.probability - left.probability);

  const [primary, secondary] = rankedProbabilities;
  const confidence = primary?.probability || 0;
  const margin = primary && secondary ? primary.probability - secondary.probability : confidence;

  return {
    modelType: "survey-softmax-classifier",
    accuracy: validAccuracy ?? testAccuracy ?? holdoutAccuracy ?? syntheticTestAccuracy ?? null,
    validAccuracy: validAccuracy ?? null,
    testAccuracy: testAccuracy ?? null,
    predictedStyleKey: primary.key,
    predictedStyleLabel: primary.label,
    confidence,
    confidencePercent: Math.round(confidence * 100),
    margin,
    marginPercent: Math.round(margin * 100),
    ambiguityLevel: getAmbiguityLevel(confidence, margin),
    probabilities: rankedProbabilities,
  };
}
