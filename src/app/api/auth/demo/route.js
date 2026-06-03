import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  findAccountById,
  getSessionCookieOptions,
} from "../../../lib/demoAuth";

export async function POST(request) {
  try {
    const { accountId } = await request.json();
    const account = findAccountById(accountId);

    if (!account) {
      return NextResponse.json({ error: "Demo hesap bulunamadi." }, { status: 404 });
    }

    const response = NextResponse.json({ user: account });
    response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(account), getSessionCookieOptions());

    return response;
  } catch {
    return NextResponse.json({ error: "Demo oturumu baslatilamadi." }, { status: 500 });
  }
}
