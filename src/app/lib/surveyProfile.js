export function buildSurveyDashboardProfile({
  rankedStyles,
  dominantStyle,
  secondaryStyle,
  blendSummary,
  dominantResult,
  analysis,
  analysisSource,
  mlPrediction,
}) {
  return {
    completedAt: new Date().toISOString(),
    blendSummary,
    analysis,
    analysisPreview: createAnalysisPreview(analysis),
    analysisSource: analysisSource || "",
    dominantStyle: dominantStyle
      ? {
          key: dominantStyle.key,
          label: dominantStyle.label,
          icon: dominantStyle.icon,
          color: dominantStyle.color,
          score: dominantStyle.score,
          percentage: dominantStyle.percentage,
        }
      : null,
    secondaryStyle: secondaryStyle
      ? {
          key: secondaryStyle.key,
          label: secondaryStyle.label,
          icon: secondaryStyle.icon,
          color: secondaryStyle.color,
          score: secondaryStyle.score,
          percentage: secondaryStyle.percentage,
        }
      : null,
    rankedStyles: (rankedStyles || []).map((style) => ({
      key: style.key,
      label: style.label,
      icon: style.icon,
      color: style.color,
      score: style.score,
      percentage: style.percentage,
    })),
    recommendedTips: dominantResult?.tips || [],
    mlPrediction: mlPrediction
      ? {
          predictedStyleLabel: mlPrediction.predictedStyleLabel,
          confidencePercent: mlPrediction.confidencePercent,
          ambiguityLevel: mlPrediction.ambiguityLevel,
          validAccuracy: mlPrediction.validAccuracy,
        }
      : null,
  };
}

function createAnalysisPreview(analysis) {
  const lines = String(analysis || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("##") && !line.endsWith(":"));

  if (!lines.length) {
    return "";
  }

  return lines.join(" ").slice(0, 260);
}

