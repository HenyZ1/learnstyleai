import { QUESTION_COUNT, loadDataset } from "./lib/varkDataset.mjs";
const STYLES = new Set(["visual", "auditory", "readwrite", "kinesthetic"]);
const GOALS = new Set(["exam", "homework", "language", "work_skill", "hobby"]);
const LEVELS = new Set(["middle_school", "high_school", "university", "adult"]);
const HOURS = new Set(["low", "medium", "high"]);
const SPANS = new Set(["short", "medium", "long"]);
const ENVIRONMENTS = new Set(["silent", "music", "group", "movement_friendly"]);
const FORMATS = new Set(["video", "notes", "discussion", "practice"]);
const CONFIDENCE = new Set(["low", "medium", "high"]);
const SPLITS = new Set(["train", "valid", "test"]);

function fail(errors, index, message) {
  errors.push(`Row ${index}: ${message}`);
}

function validateEnum(errors, index, record, field, allowed, required = true) {
  const value = record[field];

  if (!value) {
    if (required) {
      fail(errors, index, `missing '${field}'`);
    }
    return;
  }

  if (!allowed.has(value)) {
    fail(errors, index, `invalid '${field}' = '${value}'`);
  }
}

function validateInteger(errors, index, record, field, min, max) {
  const value = Number(record[field]);

  if (!Number.isInteger(value)) {
    fail(errors, index, `'${field}' must be an integer`);
    return 0;
  }

  if (value < min || value > max) {
    fail(errors, index, `'${field}' must be between ${min} and ${max}`);
  }

  return value;
}

function validateRecord(record, index, errors) {
  if (!record.id) {
    fail(errors, index, "missing 'id'");
  }

  for (let question = 1; question <= QUESTION_COUNT; question += 1) {
    validateEnum(errors, index, record, `q${question}`, STYLES);
  }

  validateEnum(errors, index, record, "study_goal", GOALS);
  validateEnum(errors, index, record, "study_level", LEVELS);
  validateEnum(errors, index, record, "weekly_study_hours", HOURS);
  validateEnum(errors, index, record, "attention_span", SPANS);
  validateEnum(errors, index, record, "preferred_environment", ENVIRONMENTS);
  validateEnum(errors, index, record, "preferred_content_format", FORMATS);
  validateEnum(errors, index, record, "primary_style", STYLES);
  validateEnum(errors, index, record, "secondary_style", STYLES, false);
  validateEnum(errors, index, record, "confidence_bucket", CONFIDENCE);
  validateEnum(errors, index, record, "split", SPLITS);

  const isMultimodal =
    typeof record.is_multimodal === "boolean"
      ? record.is_multimodal
      : String(record.is_multimodal).toLowerCase();

  if (!(isMultimodal === true || isMultimodal === false || isMultimodal === "true" || isMultimodal === "false")) {
    fail(errors, index, "'is_multimodal' must be true or false");
  }

  const visual = validateInteger(errors, index, record, "visual_score", 0, 20);
  const auditory = validateInteger(errors, index, record, "auditory_score", 0, 20);
  const readwrite = validateInteger(errors, index, record, "readwrite_score", 0, 20);
  const kinesthetic = validateInteger(errors, index, record, "kinesthetic_score", 0, 20);
  const total = visual + auditory + readwrite + kinesthetic;

  if (total !== QUESTION_COUNT) {
    fail(errors, index, `score sum must equal ${QUESTION_COUNT}, got ${total}`);
  }
}

function main() {
  const datasetPath = process.argv[2];

  if (!datasetPath) {
    throw new Error("Usage: node scripts/validate-vark-dataset.mjs <dataset-path>");
  }

  const records = loadDataset(datasetPath);

  if (!Array.isArray(records)) {
    throw new Error("Dataset must be an array or line-delimited JSON objects.");
  }

  const errors = [];
  records.forEach((record, index) => validateRecord(record, index + 1, errors));

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} issue(s).`);
    console.error(errors.slice(0, 50).join("\n"));
    process.exit(1);
  }

  console.log(`Validation passed: ${records.length} rows`);
}

main();
