"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Survey.module.css";
import { styleResults, surveyQuestions } from "../data/surveyData";
import {
  calculateSurveyScores,
  getBlendSummary,
  isSurveyComplete,
  learningStyleMeta,
  rankSurveyStyles,
} from "../data/surveyUtils";
import { buildSurveyDashboardProfile } from "../lib/surveyProfile";

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.9 4.9L19 10l-5.1 2.1L12 17l-1.9-4.9L5 10l5.1-2.1L12 3z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export default function Survey() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [analysisState, setAnalysisState] = useState("idle");
  const [analysis, setAnalysis] = useState("");
  const [analysisSource, setAnalysisSource] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [mlPrediction, setMlPrediction] = useState(null);
  const resultsRef = useRef(null);

  const answeredCount = Object.keys(answers).length;
  const completion = Math.round((answeredCount / surveyQuestions.length) * 100);
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const currentSelection = answers[currentQuestion.id];
  const surveyComplete = isSurveyComplete(answers);
  const rankedStyles = rankSurveyStyles(calculateSurveyScores(answers));
  const dominantStyle = rankedStyles[0];
  const secondaryStyle = rankedStyles[1];
  const dominantResult = dominantStyle?.score ? styleResults[dominantStyle.key] : null;
  const blendSummary = getBlendSummary(rankedStyles);

  const persistDashboardProfile = async (data) => {
    try {
      const profile = buildSurveyDashboardProfile({
        rankedStyles,
        dominantStyle,
        secondaryStyle,
        blendSummary,
        dominantResult,
        analysis: data.analysis,
        analysisSource: data.analysisSource,
        mlPrediction: data.mlPrediction,
      });

      await fetch("/api/profile/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });
    } catch {
      // Dashboard kaydi opsiyonel; survey akisini bozmasin.
    }
  };

  useEffect(() => {
    if (showResults) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResults]);

  const requestAIAnalysis = async () => {
    setAnalysisState("loading");
    setAnalysis("");
    setAnalysisSource("");
    setAnalysisError("");
    setMlPrediction(null);

    try {
      const response = await fetch("/api/survey-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI analizi alınamadı.");
      }

      setAnalysis(data.analysis);
      setAnalysisSource(data.analysisSource || "");
      setMlPrediction(data.mlPrediction || null);
      setAnalysisState("success");
      await persistDashboardProfile(data);
    } catch (error) {
      setAnalysisState("error");
      setAnalysisError(
        error instanceof Error && error.message
          ? error.message
          : "AI analizi şu anda oluşturulamadı. Lütfen tekrar deneyin."
      );
    }
  };

  const handleSelectOption = (optionType) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionType,
    }));
  };

  const handleFinishSurvey = async () => {
    if (!surveyComplete || analysisState === "loading") {
      return;
    }

    setShowResults(true);
    await requestAIAnalysis();
  };

  const handleRestart = () => {
    setShowResults(false);
    setAnalysis("");
    setAnalysisSource("");
    setAnalysisError("");
    setMlPrediction(null);
    setAnalysisState("idle");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleEditAnswers = () => {
    setShowResults(false);
    setAnalysis("");
    setAnalysisSource("");
    setAnalysisError("");
    setMlPrediction(null);
    setAnalysisState("idle");
  };

  return (
    <section className={styles.section} id="survey">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="glass-badge">
            <span className="badge-dot"></span>
            AI Destekli Anket
          </span>
          <h2 className={styles.title}>
            Öğrenme Stilinizi <span className="gradient-text">20 Soruda Çözümleyin</span>
          </h2>
          <p className={styles.desc}>
            VARK tabanlı 20 soruluk anketi tamamlayın. Sistem önce baskın öğrenme stilinizi hesaplar, ardından AI size
            özel yorum ve çalışma stratejisi üretir.
          </p>
        </div>

        {!showResults ? (
          <div className={styles.surveyLayout}>
            <div className={`glass-card-large ${styles.questionPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Soru {currentQuestionIndex + 1}</p>
                  <h3 className={styles.panelTitle}>Anketi tamamlayın, AI yorumlasın</h3>
                </div>
                <div className={styles.panelStat}>
                  <span>{answeredCount}/20</span>
                  <small>yanıtlandı</small>
                </div>
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressMeta}>
                  <span>İlerleme</span>
                  <strong>{completion}%</strong>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${completion}%` }}></div>
                </div>
              </div>

              <div className={styles.questionBlock}>
                <div className={styles.questionNumber}>Soru {currentQuestion.id}</div>
                <h4 className={styles.questionText}>{currentQuestion.text}</h4>
                <div className={styles.optionGrid}>
                  {currentQuestion.options.map((option) => {
                    const optionMeta = learningStyleMeta[option.type];
                    const isSelected = currentSelection === option.type;

                    return (
                      <button
                        key={`${currentQuestion.id}-${option.label}`}
                        className={`${styles.optionCard} ${isSelected ? styles.optionSelected : ""}`}
                        onClick={() => handleSelectOption(option.type)}
                        style={{
                          borderColor: isSelected ? optionMeta.color : undefined,
                          background: isSelected ? optionMeta.softColor : undefined,
                        }}
                        type="button"
                      >
                        <div className={styles.optionTop}>
                          <span
                            className={styles.optionLetter}
                            style={{
                              background: optionMeta.softColor,
                              color: optionMeta.color,
                            }}
                          >
                            {option.label}
                          </span>
                          <span className={styles.optionStyle}>{optionMeta.label}</span>
                        </div>
                        <p className={styles.optionText}>{option.text}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.questionNav}>
                <button
                  type="button"
                  className={`btn btn-glass ${styles.navButton}`}
                  onClick={() => setCurrentQuestionIndex((index) => Math.max(index - 1, 0))}
                  disabled={currentQuestionIndex === 0}
                >
                  Geri
                </button>

                {currentQuestionIndex < surveyQuestions.length - 1 ? (
                  <button
                    type="button"
                    className={`btn btn-primary ${styles.navButton}`}
                    onClick={() =>
                      setCurrentQuestionIndex((index) => Math.min(index + 1, surveyQuestions.length - 1))
                    }
                    disabled={!currentSelection}
                  >
                    Sonraki Soru
                    <ArrowIcon />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn btn-primary btn-glow ${styles.navButton}`}
                    onClick={handleFinishSurvey}
                    disabled={!surveyComplete || analysisState === "loading"}
                  >
                    <SparkIcon />
                    AI Profilini Oluştur
                  </button>
                )}
              </div>
            </div>

            <div className={styles.sidePanel}>
              <div className={`glass-card ${styles.sideCard}`}>
                <p className={styles.sideLabel}>Soru Haritası</p>
                <div className={styles.questionMap}>
                  {surveyQuestions.map((question, index) => {
                    const answered = Boolean(answers[question.id]);
                    const active = currentQuestionIndex === index;

                    return (
                      <button
                        key={question.id}
                        type="button"
                        className={`${styles.questionDot} ${active ? styles.questionDotActive : ""} ${
                          answered ? styles.questionDotAnswered : ""
                        }`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {question.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`glass-card ${styles.sideCard}`}>
                <p className={styles.sideLabel}>Canlı Profil Özeti</p>
                <p className={styles.liveSummary}>{blendSummary}</p>
                <div className={styles.scoreList}>
                  {rankedStyles.map((style) => (
                    <div key={style.key} className={styles.scoreRow}>
                      <div className={styles.scoreHeader}>
                        <span>
                          {style.icon} {style.label}
                        </span>
                        <strong>{style.score}</strong>
                      </div>
                      <div className={styles.scoreTrack}>
                        <div
                          className={styles.scoreFill}
                          style={{
                            width: `${style.percentage}%`,
                            background: style.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`glass-card ${styles.sideCard}`}>
                <p className={styles.sideLabel}>Nasıl Çalışır?</p>
                <ul className={styles.infoList}>
                  <li>Önce 20 soruluk anket VARK dağılımınızı hesaplar.</li>
                  <li>Ardından AI, yanıt örüntülerinize göre kişisel yorum üretir.</li>
                  <li>Sonuç ekranında baskın stil, ikincil eğilim ve öneriler birlikte gösterilir.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.resultShell} ref={resultsRef}>
            <div className={`glass-card-large ${styles.resultHero}`}>
              <div className={styles.resultBadge}>
                <SparkIcon />
                AI Sonucu Hazır
              </div>
              <div className={styles.resultTitleRow}>
                <div>
                  <h3 className={styles.resultTitle}>{dominantResult?.title || "Öğrenme Profiliniz Hazır"}</h3>
                  <p className={styles.resultSubtitle}>{blendSummary}</p>
                </div>
                {dominantStyle?.score ? (
                  <div
                    className={styles.resultIcon}
                    style={{
                      background: learningStyleMeta[dominantStyle.key].softColor,
                      color: learningStyleMeta[dominantStyle.key].color,
                    }}
                  >
                    {learningStyleMeta[dominantStyle.key].icon}
                  </div>
                ) : null}
              </div>

              <div className={styles.resultGrid}>
                <div className={`glass-card ${styles.resultCard}`}>
                  <p className={styles.cardLabel}>Temel Yorum</p>
                  <p className={styles.resultDescription}>{dominantResult?.description}</p>
                  <div className={styles.statPills}>
                    {dominantStyle?.score ? (
                      <span
                        className={styles.statPill}
                        style={{
                          background: learningStyleMeta[dominantStyle.key].softColor,
                          color: learningStyleMeta[dominantStyle.key].color,
                        }}
                      >
                        Baskın: {dominantStyle.label}
                      </span>
                    ) : null}
                    {secondaryStyle?.score ? (
                      <span
                        className={styles.statPill}
                        style={{
                          background: learningStyleMeta[secondaryStyle.key].softColor,
                          color: learningStyleMeta[secondaryStyle.key].color,
                        }}
                      >
                        İkincil: {secondaryStyle.label}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className={`glass-card ${styles.resultCard}`}>
                  <p className={styles.cardLabel}>ML Tahmini</p>
                  {mlPrediction ? (
                    <>
                      <p className={styles.resultDescription}>
                        Model bu yanıt örüntüsünü <strong>{mlPrediction.predictedStyleLabel}</strong> olarak
                        sınıflandırdı. Güven skoru %{mlPrediction.confidencePercent}, belirsizlik seviyesi{" "}
                        <strong>{mlPrediction.ambiguityLevel.toLowerCase()}</strong>.
                      </p>
                      <div className={styles.statPills}>
                        <span className={styles.statPill}>Model: %{mlPrediction.confidencePercent} güven</span>
                        <span className={styles.statPill}>
                          {mlPrediction.agreesWithRuleBased ? "Rule ile uyumlu" : "Rule ile farklı"}
                        </span>
                        {mlPrediction.validAccuracy ? (
                          <span className={styles.statPill}>
                            Valid: %{Math.round(mlPrediction.validAccuracy * 100)}
                          </span>
                        ) : null}
                      </div>
                      <div className={styles.mlProbabilityList}>
                        {mlPrediction.probabilities.map((probabilityRow) => (
                          <div key={probabilityRow.key} className={styles.mlProbabilityRow}>
                            <div className={styles.mlProbabilityHeader}>
                              <span>
                                {probabilityRow.icon} {probabilityRow.label}
                              </span>
                              <strong>%{probabilityRow.percent}</strong>
                            </div>
                            <div className={styles.mlProbabilityTrack}>
                              <div
                                className={styles.mlProbabilityFill}
                                style={{
                                  width: `${probabilityRow.percent}%`,
                                  background: probabilityRow.color,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className={styles.resultDescription}>ML sınıflandırma sonucu hazırlanıyor...</p>
                  )}
                </div>

                <div className={`glass-card ${styles.resultCard}`}>
                  <p className={styles.cardLabel}>Skor Dağılımı</p>
                  <div className={styles.scoreList}>
                    {rankedStyles.map((style) => (
                      <div key={style.key} className={styles.scoreRow}>
                        <div className={styles.scoreHeader}>
                          <span>
                            {style.icon} {style.label}
                          </span>
                          <strong>{style.score}/20</strong>
                        </div>
                        <div className={styles.scoreTrack}>
                          <div
                            className={styles.scoreFill}
                            style={{
                              width: `${style.percentage}%`,
                              background: style.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`glass-card ${styles.resultCard}`}>
                  <p className={styles.cardLabel}>Hemen Uygula</p>
                  <ul className={styles.infoList}>
                    {(dominantResult?.tips || []).map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={`glass-card-large ${styles.analysisPanel}`}>
              <div className={styles.analysisHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Kişiselleştirilmiş AI Analizi</p>
                  <h4 className={styles.analysisTitle}>Yanıt örüntünüze göre özel yorum</h4>
                  {analysisSource === "fallback" ? (
                    <p className={styles.analysisMeta}>OpenAI kapalıysa bile yerel ML özeti gösterilir.</p>
                  ) : null}
                </div>
                <div className={styles.analysisActions}>
                  <button type="button" className={`btn btn-glass ${styles.smallButton}`} onClick={handleEditAnswers}>
                    Yanıtları Düzenle
                  </button>
                  <button type="button" className={`btn btn-glass ${styles.smallButton}`} onClick={handleRestart}>
                    <RestartIcon />
                    Sıfırla
                  </button>
                </div>
              </div>

              {analysisState === "loading" ? (
                <div className={styles.loadingBox}>
                  <div className={styles.spinner}></div>
                  <p>AI yanıtlarınızı değerlendiriyor ve size özel öneriler hazırlıyor...</p>
                </div>
              ) : null}

              {analysisState === "error" ? (
                <div className={styles.errorBox}>
                  <p>{analysisError}</p>
                  <button type="button" className={`btn btn-primary ${styles.smallButton}`} onClick={requestAIAnalysis}>
                    Tekrar Dene
                  </button>
                </div>
              ) : null}

              {analysisState === "success" ? (
                <div className={styles.analysisText}>
                  {analysis.split("\n").map((line, index) => (
                    <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
