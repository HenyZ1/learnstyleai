## VARK Survey Dataset Schema

Use this schema for the first ML model we will train from the 20-question survey.

### Required fields

- `id`
- `q1` ... `q20`
- `study_goal`
- `study_level`
- `weekly_study_hours`
- `attention_span`
- `preferred_environment`
- `preferred_content_format`
- `primary_style`
- `visual_score`
- `auditory_score`
- `readwrite_score`
- `kinesthetic_score`
- `is_multimodal`
- `confidence_bucket`
- `split`

### Optional fields

- `secondary_style`

### Allowed values

#### Question fields

Each `q1` ... `q20` must be one of:

- `visual`
- `auditory`
- `readwrite`
- `kinesthetic`

#### Context fields

- `study_goal`: `exam | homework | language | work_skill | hobby`
- `study_level`: `middle_school | high_school | university | adult`
- `weekly_study_hours`: `low | medium | high`
- `attention_span`: `short | medium | long`
- `preferred_environment`: `silent | music | group | movement_friendly`
- `preferred_content_format`: `video | notes | discussion | practice`

#### Target fields

- `primary_style`: `visual | auditory | readwrite | kinesthetic`
- `secondary_style`: `visual | auditory | readwrite | kinesthetic`
- `confidence_bucket`: `low | medium | high`
- `split`: `train | valid | test`

### Score rules

- `visual_score + auditory_score + readwrite_score + kinesthetic_score = 20`
- `primary_style` must be the style with the highest score
- `secondary_style` should be the second-highest score when a secondary tendency exists
- `is_multimodal = true` when the top two scores are close enough to indicate a hybrid profile

### Recommended 100k distribution

- `25k visual primary`
- `25k auditory primary`
- `25k readwrite primary`
- `25k kinesthetic primary`

Within each primary style bucket:

- `60%` strong single-profile
- `25%` hybrid profile
- `15%` low-confidence / borderline profile

### Strong profile guidance

- Primary score usually `9-14`
- Secondary score usually `2-6`
- `confidence_bucket = high`
- `is_multimodal = false`

### Hybrid profile guidance

- Primary score usually `6-9`
- Secondary score usually `5-8`
- `confidence_bucket = medium`
- `is_multimodal = true`

### Borderline profile guidance

- Primary score usually `5-7`
- Secondary score usually `4-6`
- `confidence_bucket = low`
- `is_multimodal = true`

### Example row

```json
{
  "id": "resp_000001",
  "q1": "visual",
  "q2": "visual",
  "q3": "auditory",
  "q4": "visual",
  "q5": "readwrite",
  "q6": "visual",
  "q7": "visual",
  "q8": "auditory",
  "q9": "visual",
  "q10": "readwrite",
  "q11": "visual",
  "q12": "visual",
  "q13": "readwrite",
  "q14": "visual",
  "q15": "visual",
  "q16": "readwrite",
  "q17": "visual",
  "q18": "visual",
  "q19": "auditory",
  "q20": "visual",
  "study_goal": "exam",
  "study_level": "university",
  "weekly_study_hours": "medium",
  "attention_span": "medium",
  "preferred_environment": "silent",
  "preferred_content_format": "video",
  "primary_style": "visual",
  "secondary_style": "readwrite",
  "visual_score": 11,
  "auditory_score": 3,
  "readwrite_score": 5,
  "kinesthetic_score": 1,
  "is_multimodal": false,
  "confidence_bucket": "high",
  "split": "train"
}
```
