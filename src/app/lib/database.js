import "server-only";

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import postgres from "postgres";

let sqliteDatabase;
let postgresClient;
let postgresReady = false;

function getRemoteConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

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

  if (!postgresClient) {
    postgresClient = postgres(connectionString, {
      prepare: false,
      max: 1,
    });
  }

  if (!postgresReady) {
    await postgresClient`
      CREATE TABLE IF NOT EXISTS survey_profiles (
        user_id TEXT PRIMARY KEY,
        user_name TEXT,
        user_role TEXT,
        profile_json JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      )
    `;
    postgresReady = true;
  }

  return postgresClient;
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

  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS survey_profiles (
      user_id TEXT PRIMARY KEY,
      user_name TEXT,
      user_role TEXT,
      profile_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return sqliteDatabase;
}

export async function upsertSurveyProfile({ userId, userName, userRole, profile }) {
  try {
    const now = new Date().toISOString();
    const payload = {
      ...profile,
      userId,
      completedAt: profile?.completedAt || now,
    };
    const sql = await ensurePostgres();

    if (sql) {
      await sql`
        INSERT INTO survey_profiles (user_id, user_name, user_role, profile_json, updated_at)
        VALUES (${userId}, ${userName || ""}, ${userRole || ""}, CAST(${JSON.stringify(payload)} AS JSONB), ${now})
        ON CONFLICT (user_id)
        DO UPDATE SET
          user_name = EXCLUDED.user_name,
          user_role = EXCLUDED.user_role,
          profile_json = EXCLUDED.profile_json,
          updated_at = EXCLUDED.updated_at
      `;
      return true;
    }

    const db = ensureSqliteDatabase();
    db.prepare(
      `
          INSERT INTO survey_profiles (user_id, user_name, user_role, profile_json, updated_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(user_id)
          DO UPDATE SET
            user_name = excluded.user_name,
            user_role = excluded.user_role,
            profile_json = excluded.profile_json,
            updated_at = excluded.updated_at
        `
    ).run(userId, userName || "", userRole || "", JSON.stringify(payload), now);

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
      const rows = await sql`
        SELECT profile_json
        FROM survey_profiles
        WHERE user_id = ${userId}
        LIMIT 1
      `;

      return rows[0]?.profile_json || null;
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
