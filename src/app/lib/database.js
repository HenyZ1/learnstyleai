import "server-only";

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "learnstyle.sqlite");

let database;

function ensureDatabase() {
  if (database) {
    return database;
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  database = new DatabaseSync(DB_PATH);
  database.exec(`
    CREATE TABLE IF NOT EXISTS survey_profiles (
      user_id TEXT PRIMARY KEY,
      user_name TEXT,
      user_role TEXT,
      profile_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return database;
}

export function upsertSurveyProfile({ userId, userName, userRole, profile }) {
  const db = ensureDatabase();
  const now = new Date().toISOString();
  const payload = JSON.stringify({
    ...profile,
    userId,
    completedAt: profile?.completedAt || now,
  });

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
  ).run(userId, userName || "", userRole || "", payload, now);
}

export function getSurveyProfileByUserId(userId) {
  if (!userId) {
    return null;
  }

  const db = ensureDatabase();
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

  try {
    return JSON.parse(row.profile_json);
  } catch {
    return null;
  }
}

