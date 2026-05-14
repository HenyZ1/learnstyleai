import "server-only";

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import postgres from "postgres";
import {
  buildSurveyProfileRecord,
  ensureSurveyProfilesPostgresSchema,
  ensureSurveyProfilesSqliteSchema,
  getRemoteConnectionString,
} from "./surveyProfileSchema.mjs";

let sqliteDatabase;
let postgresClient;
let postgresReady = false;
let postgresRetryAfter = 0;

const POSTGRES_RETRY_COOLDOWN_MS = 60 * 1000;

function getSqliteDatabaseCandidates() {
  const candidates = [];

  if (!process.env.VERCEL) {
    candidates.push(path.join(process.cwd(), ".data"));
  }

  candidates.push(path.join("/tmp", "learnstyle-data"));
  return candidates;
}

async function ensurePostgres() {
  const connectionString = getRemoteConnectionString();

  if (!connectionString) {
    return null;
  }

  if (postgresRetryAfter > Date.now()) {
    return null;
  }

  if (!postgresClient) {
    postgresClient = postgres(connectionString, {
      prepare: false,
      max: 1,
    });
  }

  try {
    if (!postgresReady) {
      await ensureSurveyProfilesPostgresSchema(postgresClient);
      postgresReady = true;
    }
  } catch (error) {
    await disablePostgres(error);
    return null;
  }

  return postgresClient;
}

async function disablePostgres(error) {
  postgresReady = false;
  postgresRetryAfter = Date.now() + POSTGRES_RETRY_COOLDOWN_MS;

  if (postgresClient) {
    try {
      await postgresClient.end({ timeout: 1 });
    } catch {
      // Best effort cleanup only.
    }
  }

  postgresClient = null;
  console.warn("Remote Postgres is temporarily unavailable. Falling back to SQLite.", error);
}

function ensureSqliteDatabase() {
  if (sqliteDatabase) {
    return sqliteDatabase;
  }

  let lastError;

  for (const dataDir of getSqliteDatabaseCandidates()) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      const databasePath = path.join(dataDir, "learnstyle.sqlite");
      sqliteDatabase = new DatabaseSync(databasePath);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!sqliteDatabase) {
    throw lastError || new Error("Database could not be initialized.");
  }

  ensureSurveyProfilesSqliteSchema(sqliteDatabase);
  return sqliteDatabase;
}

export async function upsertSurveyProfile({ userId, userName, userRole, profile }) {
  try {
    const record = buildSurveyProfileRecord({ userId, userName, userRole, profile });
    const sql = await ensurePostgres();

    if (sql) {
      try {
        await sql`
          INSERT INTO survey_profiles (
            user_id,
            user_name,
            user_role,
            blend_summary,
            analysis_text,
            analysis_preview,
            analysis_source,
            dominant_style_key,
            dominant_style_label,
            dominant_style_score,
            dominant_style_percentage,
            secondary_style_key,
            secondary_style_label,
            secondary_style_score,
            secondary_style_percentage,
            ml_predicted_style_label,
            ml_confidence_percent,
            ml_ambiguity_level,
            ml_valid_accuracy,
            completed_at,
            profile_json,
            created_at,
            updated_at
          )
          VALUES (
            ${record.userId},
            ${record.userName},
            ${record.userRole},
            ${record.blendSummary},
            ${record.analysisText},
            ${record.analysisPreview},
            ${record.analysisSource},
            ${record.dominantStyleKey},
            ${record.dominantStyleLabel},
            ${record.dominantStyleScore},
            ${record.dominantStylePercentage},
            ${record.secondaryStyleKey},
            ${record.secondaryStyleLabel},
            ${record.secondaryStyleScore},
            ${record.secondaryStylePercentage},
            ${record.mlPredictedStyleLabel},
            ${record.mlConfidencePercent},
            ${record.mlAmbiguityLevel},
            ${record.mlValidAccuracy},
            ${record.completedAt},
            CAST(${JSON.stringify(record.payload)} AS JSONB),
            ${record.createdAt},
            ${record.updatedAt}
          )
          ON CONFLICT (user_id)
          DO UPDATE SET
            user_name = EXCLUDED.user_name,
            user_role = EXCLUDED.user_role,
            blend_summary = EXCLUDED.blend_summary,
            analysis_text = EXCLUDED.analysis_text,
            analysis_preview = EXCLUDED.analysis_preview,
            analysis_source = EXCLUDED.analysis_source,
            dominant_style_key = EXCLUDED.dominant_style_key,
            dominant_style_label = EXCLUDED.dominant_style_label,
            dominant_style_score = EXCLUDED.dominant_style_score,
            dominant_style_percentage = EXCLUDED.dominant_style_percentage,
            secondary_style_key = EXCLUDED.secondary_style_key,
            secondary_style_label = EXCLUDED.secondary_style_label,
            secondary_style_score = EXCLUDED.secondary_style_score,
            secondary_style_percentage = EXCLUDED.secondary_style_percentage,
            ml_predicted_style_label = EXCLUDED.ml_predicted_style_label,
            ml_confidence_percent = EXCLUDED.ml_confidence_percent,
            ml_ambiguity_level = EXCLUDED.ml_ambiguity_level,
            ml_valid_accuracy = EXCLUDED.ml_valid_accuracy,
            completed_at = EXCLUDED.completed_at,
            profile_json = EXCLUDED.profile_json,
            updated_at = EXCLUDED.updated_at
        `;
        return true;
      } catch (error) {
        await disablePostgres(error);
      }
    }

    const db = ensureSqliteDatabase();
    db.prepare(
      `
        INSERT INTO survey_profiles (
          user_id,
          user_name,
          user_role,
          blend_summary,
          analysis_text,
          analysis_preview,
          analysis_source,
          dominant_style_key,
          dominant_style_label,
          dominant_style_score,
          dominant_style_percentage,
          secondary_style_key,
          secondary_style_label,
          secondary_style_score,
          secondary_style_percentage,
          ml_predicted_style_label,
          ml_confidence_percent,
          ml_ambiguity_level,
          ml_valid_accuracy,
          completed_at,
          profile_json,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id)
        DO UPDATE SET
          user_name = excluded.user_name,
          user_role = excluded.user_role,
          blend_summary = excluded.blend_summary,
          analysis_text = excluded.analysis_text,
          analysis_preview = excluded.analysis_preview,
          analysis_source = excluded.analysis_source,
          dominant_style_key = excluded.dominant_style_key,
          dominant_style_label = excluded.dominant_style_label,
          dominant_style_score = excluded.dominant_style_score,
          dominant_style_percentage = excluded.dominant_style_percentage,
          secondary_style_key = excluded.secondary_style_key,
          secondary_style_label = excluded.secondary_style_label,
          secondary_style_score = excluded.secondary_style_score,
          secondary_style_percentage = excluded.secondary_style_percentage,
          ml_predicted_style_label = excluded.ml_predicted_style_label,
          ml_confidence_percent = excluded.ml_confidence_percent,
          ml_ambiguity_level = excluded.ml_ambiguity_level,
          ml_valid_accuracy = excluded.ml_valid_accuracy,
          completed_at = excluded.completed_at,
          profile_json = excluded.profile_json,
          updated_at = excluded.updated_at
      `
    ).run(
      record.userId,
      record.userName,
      record.userRole,
      record.blendSummary,
      record.analysisText,
      record.analysisPreview,
      record.analysisSource,
      record.dominantStyleKey,
      record.dominantStyleLabel,
      record.dominantStyleScore,
      record.dominantStylePercentage,
      record.secondaryStyleKey,
      record.secondaryStyleLabel,
      record.secondaryStyleScore,
      record.secondaryStylePercentage,
      record.mlPredictedStyleLabel,
      record.mlConfidencePercent,
      record.mlAmbiguityLevel,
      record.mlValidAccuracy,
      record.completedAt,
      JSON.stringify(record.payload),
      record.createdAt,
      record.updatedAt
    );

    return true;
  } catch (error) {
    console.error("Survey profile could not be saved.", error);
    return false;
  }
}

export async function getSurveyProfileByUserId(userId) {
  if (!userId) {
    return null;
  }

  try {
    const sql = await ensurePostgres();

    if (sql) {
      try {
        const rows = await sql`
          SELECT profile_json
          FROM survey_profiles
          WHERE user_id = ${userId}
          LIMIT 1
        `;

        return rows[0]?.profile_json || null;
      } catch (error) {
        await disablePostgres(error);
      }
    }

    const db = ensureSqliteDatabase();
    const row = db
      .prepare(
        `
          SELECT profile_json
          FROM survey_profiles
          WHERE user_id = ?
        `
      )
      .get(userId);

    if (!row?.profile_json) {
      return null;
    }

    return JSON.parse(row.profile_json);
  } catch (error) {
    console.error("Survey profile could not be read.", error);
    return null;
  }
}
