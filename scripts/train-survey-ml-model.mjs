import path from "path";
import fs from "fs";
import {
  CLASSES,
  QUESTION_COUNT,
  argmax,
  createRng,
  loadDataset,
  shuffle,
  softmax,
  splitByDeclaredSplit,
  splitDatasetStratified,
  vectorizeRecord,
} from "./lib/varkDataset.mjs";

const FEATURE_COUNT = QUESTION_COUNT * CLASSES.length;
const EPOCHS = 240;
const LEARNING_RATE = 0.04;
const DEFAULT_DATASET_PATH = path.join(process.cwd(), "datasets", "vark-training-data.json");

function createModel() {
  return {
    weights: Array.from({ length: CLASSES.length }, () => Array(FEATURE_COUNT).fill(0)),
    biases: Array(CLASSES.length).fill(0),
  };
}

function predict(sample, model) {
  const logits = model.biases.slice();

  for (const featureIndex of sample.activeIndices) {
    for (let classIndex = 0; classIndex < CLASSES.length; classIndex += 1) {
      logits[classIndex] += model.weights[classIndex][featureIndex];
    }
  }

  return softmax(logits);
}

function trainModel(trainingSet, random) {
  const model = createModel();

  for (let epoch = 0; epoch < EPOCHS; epoch += 1) {
    shuffle(trainingSet, random);

    for (const sample of trainingSet) {
      const probabilities = predict(sample, model);

      for (let classIndex = 0; classIndex < CLASSES.length; classIndex += 1) {
        const target = classIndex === sample.labelIndex ? 1 : 0;
        const error = probabilities[classIndex] - target;

        for (const featureIndex of sample.activeIndices) {
          model.weights[classIndex][featureIndex] -= LEARNING_RATE * error;
        }

        model.biases[classIndex] -= LEARNING_RATE * error;
      }
    }
  }

  return model;
}

function evaluate(samples, model) {
  let correct = 0;

  for (const sample of samples) {
    const probabilities = predict(sample, model);
    const prediction = argmax(probabilities);

    if (prediction === sample.labelIndex) {
      correct += 1;
    }
  }

  return samples.length ? correct / samples.length : 0;
}

function writeWeights(datasetPath, metrics, splitStrategy, model, sampleCount) {
  const output = `export const surveyMlWeights = ${JSON.stringify(
    {
      classes: CLASSES,
      questionCount: QUESTION_COUNT,
      learningRate: LEARNING_RATE,
      epochs: EPOCHS,
      trainingSamples: sampleCount,
      datasetPath: path.relative(process.cwd(), datasetPath),
      splitStrategy,
      validAccuracy: Number(metrics.validAccuracy.toFixed(4)),
      testAccuracy: Number(metrics.testAccuracy.toFixed(4)),
      biases: model.biases.map((value) => Number(value.toFixed(6))),
      weights: model.weights.map((row) => row.map((value) => Number(value.toFixed(6)))),
    },
    null,
    2
  )};

export default surveyMlWeights;
`;

  const outputPath = path.join(process.cwd(), "src/app/data/surveyMlWeights.js");
  fs.writeFileSync(outputPath, output, "utf8");
  return outputPath;
}

function main() {
  const datasetPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DATASET_PATH;

  if (!fs.existsSync(datasetPath)) {
    throw new Error(
      `Dataset not found at ${datasetPath}. Put your real VARK dataset there or pass a file path.`
    );
  }

  const rawRecords = loadDataset(datasetPath);
  const samples = rawRecords.map((record, index) => vectorizeRecord(record, index + 1));

  if (samples.length < 20) {
    throw new Error("At least 20 labeled rows are required to train the survey classifier.");
  }

  const random = createRng(20260415);
  const declaredSplit = splitByDeclaredSplit(samples);
  const datasetSplits = declaredSplit || splitDatasetStratified(samples, random);
  const { train, valid, test } = datasetSplits;
  const splitStrategy = declaredSplit ? "declared_split" : "generated_stratified_split";
  const model = trainModel(train, random);
  const validAccuracy = evaluate(valid, model);
  const testAccuracy = evaluate(test, model);
  const outputPath = writeWeights(
    datasetPath,
    { validAccuracy, testAccuracy },
    splitStrategy,
    model,
    samples.length
  );

  console.log(`Dataset: ${datasetPath}`);
  console.log(`Split strategy: ${splitStrategy}`);
  console.log(`Training rows: ${train.length}`);
  console.log(`Validation rows: ${valid.length}`);
  console.log(`Test rows: ${test.length}`);
  console.log(`Validation accuracy: ${(validAccuracy * 100).toFixed(2)}%`);
  console.log(`Test accuracy: ${(testAccuracy * 100).toFixed(2)}%`);
  console.log(`Wrote survey ML weights to ${outputPath}`);
}

main();
