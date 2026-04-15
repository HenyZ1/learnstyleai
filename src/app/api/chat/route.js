import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sen LearnStyle AI için çalışan Türkçe bir eğitim asistanı olarak cevap veriyorsun.
Kullanıcılara öğrenme stili, verimli ders çalışma, sınav hazırlığı, odaklanma ve kişisel öğrenme stratejileri konusunda yardım et.
Yanıtın net, pratik ve uygulanabilir olsun.
Gereksiz uzun yazma. Gerekirse madde madde anlat.
Tıbbi, psikolojik veya hukuki kesin yargılar verme; riskli konularda profesyonel destek öner.
Marka dili sıcak ama profesyonel olsun.`;

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => typeof message?.content === "string" && message.content.trim())
    .slice(-10)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.trim().slice(0, 2000),
    }));
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const textParts = [];

  for (const item of data?.output || []) {
    if (item?.type !== "message" || !Array.isArray(item.content)) {
      continue;
    }

    for (const part of item.content) {
      if (part?.type === "output_text" && typeof part.text === "string") {
        textParts.push(part.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY tanımlı değil. .env.local dosyasını kontrol edin.",
        },
        { status: 500 }
      );
    }

    const { messages } = await request.json();
    const input = normalizeMessages(messages);
    const lastMessage = input[input.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        {
          error: "Geçerli bir kullanıcı mesajı gönderilmedi.",
        },
        { status: 400 }
      );
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        store: false,
        instructions: SYSTEM_PROMPT,
        input,
        max_output_tokens: 500,
      }),
    });

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "OpenAI isteği başarısız oldu.",
        },
        { status: openAIResponse.status }
      );
    }

    const reply = extractOutputText(data);

    if (!reply) {
      return NextResponse.json(
        {
          error: "Model geçerli bir yanıt döndürmedi.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
