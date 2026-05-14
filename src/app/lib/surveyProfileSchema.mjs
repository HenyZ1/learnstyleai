export const REMOTE_CONNECTION_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "SUPABASE_DB_URL",
  "SUPABASE_DATABASE_URL",
];

const SURVEY_PROFILE_COLUMNS = [
  {
    name: "user_name",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "user_role",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "blend_summary",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "analysis_text",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "analysis_preview",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "analysis_source",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "dominant_style_key",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "dominant_style_label",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "dominant_style_score",
    postgresCreate: "INTEGER",
    postgresAlter: "INTEGER",
    sqliteCreate: "INTEGER",
    sqliteAlter: "INTEGER",
  },
  {
    name: "dominant_style_percentage",
    postgresCreate: "INTEGER",
    postgresAlter: "INTEGER",
    sqliteCreate: "INTEGER",
    sqliteAlter: "INTEGER",
  },
  {
    name: "secondary_style_key",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "secondary_style_label",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "secondary_style_score",
    postgresCreate: "INTEGER",
    postgresAlter: "INTEGER",
    sqliteCreate: "INTEGER",
    sqliteAlter: "INTEGER",
  },
  {
    name: "secondary_style_percentage",
    postgresCreate: "INTEGER",
    postgresAlter: "INTEGER",
    sqliteCreate: "INTEGER",
    sqliteAlter: "INTEGER",
  },
  {
    name: "ml_predicted_style_label",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "ml_confidence_percent",
    postgresCreate: "INTEGER",
    postgresAlter: "INTEGER",
    sqliteCreate: "INTEGER",
    sqliteAlter: "INTEGER",
  },
  {
    name: "ml_ambiguity_level",
    postgresCreate: "TEXT",
    postgresAlter: "TEXT",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "ml_valid_accuracy",
    postgresCreate: "DOUBLE PRECISION",
    postgresAlter: "DOUBLE PRECISION",
    sqliteCreate: "REAL",
    sqliteAlter: "REAL",
  },
  {
    name: "completed_at",
    postgresCreate: "TIMESTAMPTZ",
    postgresAlter: "TIMESTAMPTZ",
    sqliteCreate: "TEXT",
    sqliteAlter: "TEXT",
  },
  {
    name: "profile_json",
    postgresCreate: "JSONB NOT NULL",
    postgresAlter: "JSONB NOT NULL DEFAULT '{}'::jsonb",
    sqliteCreate: "TEXT NOT NULL",
    sqliteAlter: "TEXT NOT NULL DEFAULT '{}'",
  },
  {
    name: "created_at",
    postgresCreate: "TIMESTAMPTZ NOT NULL",
    postgresAlter: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    sqliteCreate: "TEXT NOT NULL",
    sqliteAlter: "TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP",
  },
  {
    name: "updated_at",
    postgresCreate: "TIMESTAMPTZ NOT NULL",
    postgresAlter: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    sqliteCreate: "TEXT NOT NULL",
    sqliteAlter: "TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP",
  },
];

export function getRemoteConnectionString() {
  for (const key of REMOTE_CONNECTION_ENV_KEYS) {
    if (process.env[key]) {
      return process.env[key];
    }
  }

  return "";
}

function toOptionalText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function toOptionalInteger(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? Math.round(normalized) : null;
}

function toOptionalFloat(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

function getPostgresMigrationStatements() {
  return [
    ...SURVEY_PROFILE_COLUMNS.map(
      (column) =>
        `ALTER TABLE survey_profiles ADD COLUMN IF NOT EXISTS ${column.name} ${column.postgresAlter}`
    ),
    "CREATE INDEX IF NOT EXISTS survey_profiles_updated_at_idx ON survey_profiles(updated_at DESC)",
    "CREATE INDEX IF NOT EXISTS survey_profiles_completed_at_idx ON survey_profiles(completed_at DESC)",
  ];
}

export async function ensureSurveyProfilesPostgresSchema(sql) {
  const createSql = `
    CREATE TABLE IF NOT EXISTS survey_profiles (
      user_id TEXT PRIMARY KEY,
      user_name TEXT,
      user_role TEXT,
      blend_summary TEXT,
      analysis_text TEXT,
      analysis_preview TEXT,
      analysis_source TEXT,
      dominant_style_key TEXT,
      dominant_style_label TEXT,
      dominant_style_score INTEGER,
      dominant_style_percentage INTEGER,
      secondary_style_key TEXT,
      secondary_style_label TEXT,
      secondary_style_score INTEGER,
      secondary_style_percentage INTEGER,
      ml_predicted_style_label TEXT,
      ml_confidence_percent INTEGER,
      ml_ambiguity_level TEXT,
      ml_valid_accuracy DOUBLE PRECISION,
      completed_at TIMESTAMPTZ,
      profile_json JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;

  await sql.unsafe(createSql);

  for (const statement of getPostgresMigrationStatements()) {
    await sql.unsafe(statement);
  }
}

export function ensureSurveyProfilesSqliteSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_profiles (
      user_id TEXT PRIMARY KEY,
      user_name TEXT,
      user_role TEXT,
      blend_summary TEXT,
      analysis_text TEXT,
      analysis_preview TEXT,
      analysis_source TEXT,
      dominant_style_key TEXT,
      dominant_style_label TEXT,
      dominant_style_score INTEGER,
      dominant_style_percentage INTEGER,
      secondary_style_key TEXT,
      secondary_style_label TEXT,
      secondary_style_score INTEGER,
      secondary_style_percentage INTEGER,
      ml_predicted_style_label TEXT,
      ml_confidence_percent INTEGER,
      ml_ambiguity_level TEXT,
      ml_valid_accuracy REAL,
      completed_at TEXT,
      profile_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const existingColumns = new Set(
    db
      .prepare("PRAGMA table_info(survey_profiles)")
      .all()
      .map((column) => column.name)
  );

  for (const column of SURVEY_PROFILE_COLUMNS) {
    if (existingColumns.has(column.name)) {
      continue;
    }

    db.exec(`ALTER TABLE survey_profiles ADD COLUMN ${column.name} ${column.sqliteAlter}`);
  }

  db.exec(
    "CREATE INDEX IF NOT EXISTS survey_profiles_updated_at_idx ON survey_profiles(updated_at DESC);"
  );
  db.exec(
    "CREATE INDEX IF NOT EXISTS survey_profiles_completed_at_idx ON survey_profiles(completed_at DESC);"
  );
}

export function buildSurveyProfileRecord({ userId, userName, userRole, profile }) {
  const now = new Date().toISOString();
  const completedAt = toOptionalText(profile?.completedAt) || now;
  const payload = {
    ...profile,
    userId,
    completedAt,
  };

  return {
    payload,
    userId,
    userName: toOptionalText(userName),
    userRole: toOptionalText(userRole),
    blendSummary: toOptionalText(payload.blendSummary),
    analysisText: toOptionalText(payload.analysis),
    analysisPreview: toOptionalText(payload.analysisPreview),
    analysisSource: toOptionalText(payload.analysisSource),
    dominantStyleKey: toOptionalText(payload.dominantStyle?.key),
    dominantStyleLabel: toOptionalText(payload.dominantStyle?.label),
    dominantStyleScore: toOptionalInteger(payload.dominantStyle?.score),
    dominantStylePercentage: toOptionalInteger(payload.dominantStyle?.percentage),
    secondaryStyleKey: toOptionalText(payload.secondaryStyle?.key),
    secondaryStyleLabel: toOptionalText(payload.secondaryStyle?.label),
    secondaryStyleScore: toOptionalInteger(payload.secondaryStyle?.score),
    secondaryStylePercentage: toOptionalInteger(payload.secondaryStyle?.percentage),
    mlPredictedStyleLabel: toOptionalText(payload.mlPrediction?.predictedStyleLabel),
    mlConfidencePercent: toOptionalInteger(payload.mlPrediction?.confidencePercent),
    mlAmbiguityLevel: toOptionalText(payload.mlPrediction?.ambiguityLevel),
    mlValidAccuracy: toOptionalFloat(payload.mlPrediction?.validAccuracy),
    completedAt,
    createdAt: now,
    updatedAt: now,
  };
}
