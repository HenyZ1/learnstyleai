import fs from "fs";
import path from "path";
import postgres from "postgres";
import {
  REMOTE_CONNECTION_ENV_KEYS,
  ensureSurveyProfilesPostgresSchema,
  getRemoteConnectionString,
} from "../src/app/lib/surveyProfileSchema.mjs";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();

    if (!key || process.env[key]) {
      continue;
    }

    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

async function main() {
  const rootDir = process.cwd();
  loadEnvFile(path.join(rootDir, ".env"));
  loadEnvFile(path.join(rootDir, ".env.local"));

  const connectionString = getRemoteConnectionString();

  if (!connectionString) {
    throw new Error(
      `No Postgres connection string found. Set one of: ${REMOTE_CONNECTION_ENV_KEYS.join(", ")}`
    );
  }

  const sql = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  try {
    await ensureSurveyProfilesPostgresSchema(sql);
    console.log("Supabase schema is ready: survey_profiles");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
