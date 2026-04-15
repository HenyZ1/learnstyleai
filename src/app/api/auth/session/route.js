import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../../lib/demoAuth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = verifySessionToken(token);

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
  });
}

