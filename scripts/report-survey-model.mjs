import path from "path";
import { pathToFileURL } from "url";
import {
  CLASSES,
  argmax,
  loadDataset,
  softmax,
  vectorizeRecord,
} from "./lib/varkDataset.mjs";

function loadWeights(weightsPath) {
  return import(pathToFileURL(path.resolve(weightsPath)).href);
}

function predictProbabilities(sample, weightsModule) {
  const { weights, biases } = weightsModule.surveyMlWeights;
  const logits = biases.slice();

  for (const featureIndex of sample.activeIndices) {
    for (let classIndex = 0; classIndex < CLASSES.length; classIndex += 1) {
      logits[classIndex] += weights[classIndex][featureIndex];
    }
  }

  return softmax(logits);
}

function createConfusionMatrix() {
  return Array.from({ length: CLASSES.length }, () => Array(CLASSES.length).fill(0));
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function renderConfusionMatrix(matrix) {
  const header = ["actual \\ predicted", ...CLASSES].join("\t");
  const rows = matrix.map((row, index) => [CLASSES[index], ...row].join("\t"));
  return [header, ...rows].join("\n");
}

function computeClassReport(matrix) {
  return CLASSES.map((className, index) => {
    const tp = matrix[index][index];
    const fn = matrix[index].reduce((sum, value) => sum + value, 0) - tp;
    const fp = matrix.reduce((sum, row) => sum + row[index], 0) - tp;
    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    const support = matrix[index].reduce((sum, value) => sum + value, 0);

    return {
      className,
      precision,
      recall,
      f1,
      support,
    };
  });
}

async function main() {
  const datasetPath = process.argv[2] || "./vark_survey_100k_dataset.json";
  const weightsPath = process.argv[3] || "./src/app/data/surveyMlWeights.js";
  const records = loadDataset(datasetPath);
  const samples = records.map((record, index) => vectorizeRecord(record, index + 1)).filter((row) => row.split === "valid");

  if (samples.length === 0) {
    throw new Error("No rows with split='valid' were found.");
  }

  const weightsModule = await loadWeights(weightsPath);
  const matrix = createConfusionMatrix();
  let correct = 0;

  for (const sample of samples) {
    const probabilities = predictProbabilities(sample, weightsModule);
    const predictedIndex = argmax(probabilities);

    matrix[sample.labelIndex][predictedIndex] += 1;

    if (predictedIndex === sample.labelIndex) {
      correct += 1;
    }
  }

  const accuracy = correct / samples.length;
  const report = computeClassReport(matrix);

  console.log(`Dataset: ${path.resolve(datasetPath)}`);
  console.log(`Weights: ${path.resolve(weightsPath)}`);
  console.log(`Validation rows: ${samples.length}`);
  console.log(`Validation accuracy: ${formatPercent(accuracy)}`);
  console.log("");
  console.log("Confusion matrix");
  console.log(renderConfusionMatrix(matrix));
  console.log("");
  console.log("Class report");

  for (const row of report) {
    console.log(
      `${row.className}\tprecision=${formatPercent(row.precision)}\trecall=${formatPercent(row.recall)}\tf1=${formatPercent(
        row.f1
      )}\tsupport=${row.support}`
    );
  }
}

main();
