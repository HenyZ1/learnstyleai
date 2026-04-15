## LearnStyle AI

This is a Next.js project for LearnStyle AI.

## Getting Started

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your OpenAI settings into `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Survey Analysis

The 20-question survey sends answers to `src/app/api/survey-analysis/route.js`.
This route calls the OpenAI Responses API on the server and returns a personalized learning-style interpretation.
It also includes a lightweight local ML classifier for VARK-style prediction, confidence, and ambiguity scoring.

To train the local survey model from your real dataset:

```bash
cp datasets/vark-training-data.template.json datasets/vark-training-data.json
node scripts/train-survey-ml-model.mjs
```

You can also pass a custom dataset path:

```bash
node scripts/train-survey-ml-model.mjs ./path/to/your-dataset.json
```

Supported formats: `.json`, `.jsonl`, `.csv`

Recommended survey dataset schema:

- [datasets/VARK_SURVEY_SCHEMA.md](/Users/bahadirefeyilmaz/Desktop/learnstyleai-main/datasets/VARK_SURVEY_SCHEMA.md)

To validate a generated dataset before training:

```bash
node scripts/validate-vark-dataset.mjs ./datasets/vark-survey-dataset.template.jsonl
```

To report validation metrics for a trained model:

```bash
node scripts/report-survey-model.mjs ./vark_survey_100k_dataset.json ./src/app/data/surveyMlWeights.js
```

To analyze how deterministic a generated dataset is:

```bash
node scripts/analyze-survey-determinism.mjs ./vark_survey_100k_dataset.json
```

If you shared an API key in chat or screenshots, rotate it after setup and replace it in `.env.local`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
