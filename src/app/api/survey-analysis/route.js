import { NextResponse } from "next/server";
import { styleResults, surveyQuestions } from "../../data/surveyData";
import {
  calculateSurveyScores,
  getBlendSummary,
  getSurveyAnswerDetails,
  isSurveyComplete,
  rankSurveyStyles,
} from "../../data/surveyUtils";
import { predictSurveyProfileML } from "../../data/surveyMl";

const SYSTEM_PROMPT = `Sen LearnStyle AI için çalışan Türkçe bir öğrenme stratejisi uzmanısın.
20 soruluk VARK tabanlı anket sonuçlarını yorumluyorsun.
Yanıtın kişisel, net, uygulanabilir ve kısa paragraflar + düz listeler halinde olsun.
Tıbbi veya psikolojik tanı koyma.
Kullanıcıya uygulanabilir çalışma önerileri, güçlü yönler, dikkat edilmesi gereken noktalar ve kısa bir plan sun.`;

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

function buildFallbackAnalysis({
  dominantStyle,
  secondaryStyle,
  dominantResult,
  blendSummary,
  mlPrediction,
}) {
  return [
    "Genel Profil",
    `${dominantStyle.label} eğiliminiz öne çıkıyor. ${blendSummary}`,
    `ML sınıflandırıcı bu profili %${mlPrediction.confidencePercent} güven ile ${mlPrediction.predictedStyleLabel} olarak işaretledi.`,
    "",
    "Güçlü Yönlerin",
    `- ${dominantResult.description}`,
    secondaryStyle ? `- ${secondaryStyle.label} eğiliminiz ikinci sırada olduğu için hibrit öğrenme potansiyeliniz güçlü.` : "",
    "",
    "Sana Uygun Çalışma Yöntemleri",
    ...dominantResult.tips.map((tip) => `- ${tip}`),
    "",
    "Dikkat Etmen Gerekenler",
    `- Belirsizlik seviyesi: ${mlPrediction.ambiguityLevel}. Bu nedenle tek yönteme bağlı kalmak yerine iki farklı çalışma biçimini birlikte deneyin.`,
    "- Öğrenme stilini sabit bir etiket gibi değil, baskın eğilim gibi düşünün.",
    "",
    "7 Günlük Mini Plan",
    "- 1-2. gün: Baskın stilinize uygun ana çalışma düzenini kurun.",
    "- 3-4. gün: İkincil eğiliminize uygun ikinci yöntemi ekleyin.",
    "- 5. gün: Kısa bir tekrar ve mini öz değerlendirme yapın.",
    "- 6-7. gün: En verimli gelen yöntemi sabitleyin ve bir sonraki haftaya plan çıkarın.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request) {
  try {
    const { answers } = await request.json();

    if (!isSurveyComplete(answers)) {
      return NextResponse.json(
        {
          error: `Analiz için tüm ${surveyQuestions.length} sorunun yanıtlanması gerekiyor.`,
        },
        { status: 400 }
      );
    }

    const scores = calculateSurveyScores(answers);
    const rankedStyles = rankSurveyStyles(scores);
    const dominantStyle = rankedStyles[0];
    const secondaryStyle = rankedStyles[1];
    const dominantResult = styleResults[dominantStyle.key];
    const answerDetails = getSurveyAnswerDetails(answers);
    const blendSummary = getBlendSummary(rankedStyles);
    const mlPrediction = predictSurveyProfileML(answers);
    const enrichedMlPrediction = {
      ...mlPrediction,
      agreesWithRuleBased: mlPrediction.predictedStyleKey === dominantStyle.key,
      ruleBasedStyleKey: dominantStyle.key,
      ruleBasedStyleLabel: dominantStyle.label,
    };
    const fallbackAnalysis = buildFallbackAnalysis({
      dominantStyle,
      secondaryStyle,
      dominantResult,
      blendSummary,
      mlPrediction: enrichedMlPrediction,
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        analysis: fallbackAnalysis,
        analysisSource: "fallback",
        mlPrediction: enrichedMlPrediction,
      });
    }

    const prompt = [
      "Aşağıdaki öğrenme stili anketi sonuçlarına göre kısa ama kişiselleştirilmiş bir değerlendirme yaz.",
      "Çıktı Türkçe olsun ve şu başlıkları aynen kullan:",
      "Genel Profil",
      "Güçlü Yönlerin",
      "Sana Uygun Çalışma Yöntemleri",
      "Dikkat Etmen Gerekenler",
      "7 Günlük Mini Plan",
      "",
      `Baskın stil: ${dominantStyle.label} (${dominantStyle.score}/${surveyQuestions.length})`,
      secondaryStyle
        ? `İkincil stil: ${secondaryStyle.label} (${secondaryStyle.score}/${surveyQuestions.length})`
        : "İkincil stil: Belirsiz",
      `Karma profil özeti: ${blendSummary}`,
      `ML tahmini: ${enrichedMlPrediction.predictedStyleLabel} (%${enrichedMlPrediction.confidencePercent} güven)`,
      `ML belirsizlik seviyesi: ${enrichedMlPrediction.ambiguityLevel}`,
      `Rule-based ve ML uyumu: ${enrichedMlPrediction.agreesWithRuleBased ? "uyumlu" : "farklı"}`,
      `Temel açıklama: ${dominantResult.description}`,
      `Yerleşik öneriler: ${dominantResult.tips.join("; ")}`,
      "",
      "Skor dağılımı:",
      rankedStyles.map((style) => `- ${style.label}: ${style.score}`).join("\n"),
      "",
      "Soru bazlı yanıtlar:",
      answerDetails
        .map(
          (item) =>
            `${item.questionId}. Soru: ${item.question}\nYanıt: ${item.answer}\nKategori: ${item.styleLabel}`
        )
        .join("\n\n"),
    ].join("\n");

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
        input: prompt,
        max_output_tokens: 900,
      }),
    });

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      return NextResponse.json({
        analysis: fallbackAnalysis,
        analysisSource: "fallback",
        mlPrediction: enrichedMlPrediction,
        warning: data?.error?.message || "OpenAI isteği başarısız oldu.",
      });
    }

    const analysis = extractOutputText(data);

    if (!analysis) {
      return NextResponse.json({
        analysis: fallbackAnalysis,
        analysisSource: "fallback",
        mlPrediction: enrichedMlPrediction,
        warning: "Model geçerli bir analiz döndürmedi.",
      });
    }

    return NextResponse.json({
      analysis,
      analysisSource: "ai",
      mlPrediction: enrichedMlPrediction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
