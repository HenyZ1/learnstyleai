import fs from "fs";
import path from "path";

export const CLASSES = ["visual", "auditory", "readwrite", "kinesthetic"];
export const QUESTION_COUNT = 20;

export function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exponentials = logits.map((logit) => Math.exp(logit - maxLogit));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function argmax(values) {
  let bestIndex = 0;

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > values[bestIndex]) {
      bestIndex = index;
    }
  }

  return bestIndex;
}

export function createRng(seed = 42) {
  let state = seed >>> 0;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function shuffle(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

export function normalizeStyle(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("/", "")
    .replaceAll("-", "")
    .replaceAll("_", "");

  if (normalized === "readwrite" || normalized === "okumayazma") {
    return "readwrite";
  }

  if (normalized === "visual" || normalized === "gorsel") {
    return "visual";
  }

  if (normalized === "auditory" || normalized === "isitsel" || normalized === "aural") {
    return "auditory";
  }

  if (normalized === "kinesthetic" || normalized === "kinestetik") {
    return "kinesthetic";
  }

  return "";
}

export function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      row.push(current);
      current = "";

      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((key, i) => [key, (cells[i] || "").trim()])));
}

export function loadDataset(datasetPath) {
  const absolutePath = path.resolve(datasetPath);
  const extension = path.extname(absolutePath).toLowerCase();
  const raw = fs.readFileSync(absolutePath, "utf8");

  if (extension === ".json") {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      throw new Error("JSON dataset must be an array.");
    }
    return data;
  }

  if (extension === ".jsonl") {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  if (extension === ".csv") {
    return parseCsv(raw);
  }

  throw new Error("Unsupported dataset format. Use .json, .jsonl, or .csv.");
}

export function extractAnswers(record) {
  const nestedAnswers = record.answers && typeof record.answers === "object" ? record.answers : null;
  const answers = [];

  for (let questionId = 1; questionId <= QUESTION_COUNT; questionId += 1) {
    const rawValue = nestedAnswers?.[questionId] ?? nestedAnswers?.[`q${questionId}`] ?? record[`q${questionId}`];
    const style = normalizeStyle(rawValue);

    if (!style) {
      return null;
    }

    answers.push(style);
  }

  return answers;
}

export function extractLabel(record) {
  return (
    normalizeStyle(record.primary_style) ||
    normalizeStyle(record.primaryStyle) ||
    normalizeStyle(record.label) ||
    normalizeStyle(record.target) ||
    normalizeStyle(record.dominant_style) ||
    normalizeStyle(record.dominantStyle)
  );
}

export function vectorizeRecord(record, index) {
  const answers = extractAnswers(record);
  const label = extractLabel(record);

  if (!answers) {
    throw new Error(`Record ${index} is missing one or more answers q1..q20.`);
  }

  if (!label || !CLASSES.includes(label)) {
    throw new Error(`Record ${index} is missing a valid label/target/dominant_style.`);
  }

  const activeIndices = answers.map(
    (style, questionIndex) => questionIndex * CLASSES.length + CLASSES.indexOf(style)
  );

  return {
    id: record.id ?? `row_${index}`,
    split: record.split || "",
    answers,
    label,
    labelIndex: CLASSES.indexOf(label),
    activeIndices,
  };
}

export function splitByDeclaredSplit(samples) {
  const groups = {
    train: [],
    valid: [],
    test: [],
  };

  for (const sample of samples) {
    if (sample.split === "train" || sample.split === "valid" || sample.split === "test") {
      groups[sample.split].push(sample);
    }
  }

  if (groups.train.length && groups.valid.length && groups.test.length) {
    return groups;
  }

  return null;
}

export function splitDatasetStratified(samples, random) {
  const grouped = new Map(CLASSES.map((className) => [className, []]));

  for (const sample of samples) {
    grouped.get(CLASSES[sample.labelIndex]).push(sample);
  }

  const train = [];
  const valid = [];
  const test = [];

  for (const className of CLASSES) {
    const bucket = grouped.get(className);
    shuffle(bucket, random);
    const trainEnd = Math.max(1, Math.floor(bucket.length * 0.8));
    const validEnd = Math.max(trainEnd + 1, Math.floor(bucket.length * 0.9));

    train.push(...bucket.slice(0, trainEnd));
    valid.push(...bucket.slice(trainEnd, validEnd));
    test.push(...bucket.slice(validEnd));
  }

  shuffle(train, random);
  shuffle(valid, random);
  shuffle(test, random);

  return { train, valid, test };
}

export function scoresFromAnswers(answers) {
  const scores = {
    visual: 0,
    auditory: 0,
    readwrite: 0,
    kinesthetic: 0,
  };

  for (const answer of answers) {
    if (scores[answer] !== undefined) {
      scores[answer] += 1;
    }
  }

  return scores;
}

export function rankedScores(scores) {
  return Object.entries(scores).sort((left, right) => right[1] - left[1]);
}
