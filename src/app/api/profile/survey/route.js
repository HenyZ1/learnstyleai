import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSurveyProfileByUserId, upsertSurveyProfile } from "../../../lib/database";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../../lib/demoAuth";

function getAuthenticatedUser(cookieStore) {
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  const cookieStore = await cookies();
  const user = getAuthenticatedUser(cookieStore);

  if (!user) {
    return NextResponse.json(
      {
        error: "Oturum bulunamadi.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    profile: await getSurveyProfileByUserId(user.id),
  });
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const user = getAuthenticatedUser(cookieStore);

    if (!user) {
      return NextResponse.json(
        {
          error: "Anket sonucunu kaydetmek icin giris yapmaniz gerekiyor.",
        },
        { status: 401 }
      );
    }

    const { profile } = await request.json();

    if (!profile || typeof profile !== "object") {
      return NextResponse.json(
        {
          error: "Gecerli bir profil verisi gonderilmedi.",
        },
        { status: 400 }
      );
    }

    await upsertSurveyProfile({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      profile,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Beklenmeyen bir hata olustu.",
      },
      { status: 500 }
    );
  }
}
