import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  findAccountByCredentials,
  getSessionCookieOptions,
} from "../../../lib/demoAuth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const account = findAccountByCredentials(email, password);

    if (!account) {
      return NextResponse.json(
        {
          error: "E-posta veya sifre hatali.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: account,
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      createSessionToken(account),
      getSessionCookieOptions()
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Beklenmeyen bir hata olustu.",
      },
      { status: 500 }
    );
  }
}

