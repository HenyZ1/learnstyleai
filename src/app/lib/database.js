import "server-only";

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

let database;
let databasePath;

function getDatabaseCandidates() {
  const candidates = [];

  if (!process.env.VERCEL) {
    candidates.push(path.join(process.cwd(), ".data"));
  }

  candidates.push(path.join("/tmp", "learnstyle-data"));
  return candidates;
}

function ensureDatabase() {
  if (database) {
    return database;
  }

  let lastError;

  for (const dataDir of getDatabaseCandidates()) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      databasePath = path.join(dataDir, "learnstyle.sqlite");
      database = new DatabaseSync(databasePath);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!database) {
    throw lastError || new Error("Database could not be initialized.");
  }

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
  try {
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

    return true;
  } catch (error) {
    console.error("Survey profile could not be saved.", error);
    return false;
  }
}

export function getSurveyProfileByUserId(userId) {
  if (!userId) {
    return null;
  }

  try {
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

    return JSON.parse(row.profile_json);
  } catch (error) {
    console.error("Survey profile could not be read.", error);
    return null;
  }
}
