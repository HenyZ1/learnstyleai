import crypto from "crypto";

export const SESSION_COOKIE_NAME = "learnstyle_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const DEMO_ACCOUNTS = [
  {
    id: "teacher-deniz",
    name: "Deniz Hoca",
    email: process.env.DEMO_TEACHER_EMAIL || "deniz.hoca@learnstyle.ai",
    password: process.env.DEMO_TEACHER_PASSWORD || "DenizHoca2026!",
    role: "teacher",
    roleLabel: "Egitmen",
    summary: "Anket sonuclarini ve genel platform akisini incelemek icin egitmen hesabi.",
  },
  {
    id: "student-shared",
    name: "Ogrenci Hesabi",
    email: process.env.DEMO_STUDENT_EMAIL || "ogrenciler@learnstyle.ai",
    password: process.env.DEMO_STUDENT_PASSWORD || "Ogrenci2026!",
    role: "student",
    roleLabel: "Ogrenci",
    summary: "Ogrenciler icin ortak demo hesap. Anket, AI yorum ve chat akisini test eder.",
  },
];

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET || "learnstyleai-demo-session-secret-2026";
}

function createSignature(payload) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function encodePayload(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodePayload(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

export function getDemoAccounts() {
  return DEMO_ACCOUNTS.map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    roleLabel: account.roleLabel,
    summary: account.summary,
  }));
}

export function sanitizeAccount(account) {
  if (!account) {
    return null;
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    roleLabel: account.roleLabel,
    summary: account.summary,
  };
}

export function findAccountByCredentials(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");

  const account = DEMO_ACCOUNTS.find(
    (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === normalizedPassword
  );

  return account ? sanitizeAccount(account) : null;
}

export function createSessionToken(account) {
  const payload = encodePayload({
    id: account.id,
    email: account.email,
    role: account.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const signature = createSignature(payload);

  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const decoded = decodePayload(payload);

    if (
      !decoded?.email ||
      !decoded?.id ||
      !decoded?.role ||
      typeof decoded.exp !== "number" ||
      decoded.exp < Date.now()
    ) {
      return null;
    }

    const account = DEMO_ACCOUNTS.find(
      (entry) =>
        entry.id === decoded.id &&
        entry.email === decoded.email &&
        entry.role === decoded.role
    );

    return sanitizeAccount(account);
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
