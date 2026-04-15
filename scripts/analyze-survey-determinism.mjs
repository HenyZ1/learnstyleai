import { loadDataset, extractAnswers, extractLabel, rankedScores, scoresFromAnswers } from "./lib/varkDataset.mjs";

function majorityLabelFromScores(scores) {
  return rankedScores(scores)[0][0];
}

function scoreTupleKey(scores) {
  return `${scores.visual}-${scores.auditory}-${scores.readwrite}-${scores.kinesthetic}`;
}

function contextKey(record) {
  return [
    record.study_goal,
    record.study_level,
    record.weekly_study_hours,
    record.attention_span,
    record.preferred_environment,
    record.preferred_content_format,
  ].join("|");
}

function purityFromGrouping(records, keyFn) {
  const groups = new Map();

  for (const record of records) {
    const key = keyFn(record);
    const label = record.primary_style;

    if (!groups.has(key)) {
      groups.set(key, { total: 0, labels: {} });
    }

    const bucket = groups.get(key);
    bucket.total += 1;
    bucket.labels[label] = (bucket.labels[label] || 0) + 1;
  }

  let weightedPurity = 0;
  let deterministicGroups = 0;

  for (const bucket of groups.values()) {
    const majority = Math.max(...Object.values(bucket.labels));
    const purity = majority / bucket.total;
    weightedPurity += purity * bucket.total;

    if (purity === 1) {
      deterministicGroups += 1;
    }
  }

  return {
    groups: groups.size,
    weightedPurity: weightedPurity / records.length,
    fullyDeterministicGroupRate: deterministicGroups / groups.size,
  };
}

function main() {
  const datasetPath = process.argv[2] || "./vark_survey_100k_dataset.json";
  const records = loadDataset(datasetPath);
  let scoreRuleMatches = 0;
  let answerRuleMatches = 0;
  let narrowMargin = 0;
  let onePointMargin = 0;
  let multimodalRows = 0;
  const enriched = [];

  for (const record of records) {
    const answers = extractAnswers(record);
    const label = extractLabel(record);
    const scores = scoresFromAnswers(answers);
    const ranked = rankedScores(scores);
    const [top, second] = ranked;
    const margin = top[1] - second[1];
    const primaryFromAnswers = majorityLabelFromScores(scores);

    if (label === primaryFromAnswers) {
      scoreRuleMatches += 1;
      answerRuleMatches += 1;
    }

    if (margin <= 2) {
      narrowMargin += 1;
    }

    if (margin <= 1) {
      onePointMargin += 1;
    }

    if (record.is_multimodal === true || record.is_multimodal === "true") {
      multimodalRows += 1;
    }

    enriched.push({
      ...record,
      primary_style: label,
      scoreTupleKey: scoreTupleKey(scores),
      contextKey: contextKey(record),
    });
  }

  const scorePurity = purityFromGrouping(enriched, (record) => record.scoreTupleKey);
  const contextPurity = purityFromGrouping(enriched, (record) => record.contextKey);

  console.log(JSON.stringify({
    rows: records.length,
    scoreRuleMatchRate: Number((scoreRuleMatches / records.length).toFixed(6)),
    answerRuleMatchRate: Number((answerRuleMatches / records.length).toFixed(6)),
    narrowMarginRate: Number((narrowMargin / records.length).toFixed(6)),
    onePointMarginRate: Number((onePointMargin / records.length).toFixed(6)),
    multimodalRate: Number((multimodalRows / records.length).toFixed(6)),
    scoreTuplePurity: {
      groups: scorePurity.groups,
      weightedPurity: Number(scorePurity.weightedPurity.toFixed(6)),
      fullyDeterministicGroupRate: Number(scorePurity.fullyDeterministicGroupRate.toFixed(6)),
    },
    contextOnlyPurity: {
      groups: contextPurity.groups,
      weightedPurity: Number(contextPurity.weightedPurity.toFixed(6)),
      fullyDeterministicGroupRate: Number(contextPurity.fullyDeterministicGroupRate.toFixed(6)),
    },
  }, null, 2));
}

main();
