"use client";
import { useState, useEffect } from "react";
import styles from "./Survey.module.css";

// SVG Icons
const BrainIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="50%" stopColor="#6366f1" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
        <g stroke="url(#csGrad)">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
            <line x1="9" y1="21" x2="15" y2="21" /><line x1="10" y1="24" x2="14" y2="24" />
            <circle cx="10" cy="9" r="0.5" fill="url(#csGrad)" /><circle cx="14" cy="9" r="0.5" fill="url(#csGrad)" />
            <path d="M10 12a2 2 0 0 0 4 0" />
        </g>
    </svg>
);

const NeuralIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="5" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
        <line x1="12" y1="7" x2="12" y2="17" /><line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7.05" y1="7.05" x2="16.95" y2="16.95" opacity="0.4" /><line x1="16.95" y1="7.05" x2="7.05" y2="16.95" opacity="0.4" />
    </svg>
);

const ChartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="15" x2="8" y2="9" /><line x1="12" y1="15" x2="12" y2="7" /><line x1="16" y1="15" x2="16" y2="11" />
    </svg>
);

const TargetIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" />
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

export default function Survey() {
    const [progress, setProgress] = useState(0);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState("");
    const [submitState, setSubmitState] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setProgress(73), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            setSubmitState("error");
            setMessage("Lütfen geçerli bir e-posta adresi girin.");
            return;
        }
        setSubmitState("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitState("success");
                setMessage(data.already ? "Bu e-posta zaten kayıtlı! 🎉" : "Kaydınız alındı! Anket hazır olduğunda size haber vereceğiz. 🚀");
            } else {
                setSubmitState("error");
                setMessage(data.error || "Bir hata oluştu.");
            }
        } catch {
            setSubmitState("error");
            setMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
        }
    };

    const milestones = [
        { label: "VARK Modeli Entegrasyonu", done: true },
        { label: "AI Analiz Motoru", done: true },
        { label: "Kişiselleştirilmiş Sonuçlar", active: true },
        { label: "Canlı Yayın", done: false },
    ];

    return (
        <section className={styles.section} id="survey">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className="glass-badge"><span className="badge-dot"></span>Anket</span>
                    <h2 className={styles.title}>Öğrenme Stilinizi <span className="gradient-text">Keşfedin</span></h2>
                    <p className={styles.desc}>20 sorudan oluşan anketimizi tamamlayarak kendi öğrenme stilinizi öğrenin.</p>
                </div>
                <div className={`glass-card-large ${styles.surveyBox}`}>
                    <div className={styles.comingSoon}>
                        {/* Animated AI Brain Icon */}
                        <div className={styles.aiIconWrapper}>
                            <div className={styles.aiIconRing1}></div>
                            <div className={styles.aiIconRing2}></div>
                            <div className={styles.aiIconRing3}></div>
                            <div className={styles.aiIconCore}><BrainIcon /></div>
                        </div>

                        {/* Tag */}
                        <div className={styles.csTag}>
                            <span className={styles.csTagDot}></span>
                            Geliştirme Aşamasında
                        </div>

                        {/* Title */}
                        <h3 className={styles.csTitle}>
                            Yapay Zeka Entegrasyonu
                            <br />
                            <span className={styles.csTitleGlow}>Tamamlanıyor</span>
                            <span className={styles.csDots}>
                                <span className={styles.dot} style={{ animationDelay: "0s" }}>.</span>
                                <span className={styles.dot} style={{ animationDelay: "0.3s" }}>.</span>
                                <span className={styles.dot} style={{ animationDelay: "0.6s" }}>.</span>
                            </span>
                        </h3>

                        <p className={styles.csDesc}>
                            Öğrenme stilinizi en doğru şekilde analiz edebilmek için <strong>gelişmiş yapay zeka modelimizi</strong> eğitiyoruz.
                            20 soruluk kişiselleştirilmiş anketimiz, AI destekli derin analiz ile birlikte çok yakında sizlerle buluşacak.
                        </p>

                        {/* Progress */}
                        <div className={styles.csProgress}>
                            <div className={styles.csProgressHeader}>
                                <span className={styles.csProgressLabel}>Geliştirme İlerlemesi</span>
                                <span className={styles.csProgressPercent}>{progress}%</span>
                            </div>
                            <div className={styles.csProgressBar}>
                                <div className={styles.csProgressFill} style={{ width: `${progress}%` }}>
                                    <div className={styles.csProgressShimmer}></div>
                                </div>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className={styles.csMilestones}>
                            {milestones.map((m, i) => (
                                <div key={i} className={`${styles.csMilestone} ${m.done ? styles.csDone : ""} ${m.active ? styles.csActive : ""}`}>
                                    <div className={styles.csMilestoneIcon}>
                                        {m.done ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        ) : m.active ? (
                                            <div className={styles.csActiveSpinner}></div>
                                        ) : (
                                            <div className={styles.csEmptyDot}></div>
                                        )}
                                    </div>
                                    <span>{m.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Features - SVG Icons */}
                        <div className={styles.csFeatures}>
                            <div className={styles.csFeature}>
                                <div className={`${styles.csFeatureIcon} ${styles.fPurple}`}><NeuralIcon /></div>
                                <div>
                                    <strong>Derin AI Analizi</strong>
                                    <p>GPT destekli öğrenme profili oluşturma</p>
                                </div>
                            </div>
                            <div className={styles.csFeature}>
                                <div className={`${styles.csFeatureIcon} ${styles.fCyan}`}><ChartIcon /></div>
                                <div>
                                    <strong>Detaylı Rapor</strong>
                                    <p>Kişiselleştirilmiş öğrenme stratejileri</p>
                                </div>
                            </div>
                            <div className={styles.csFeature}>
                                <div className={`${styles.csFeatureIcon} ${styles.fOrange}`}><TargetIcon /></div>
                                <div>
                                    <strong>Akıllı Öneriler</strong>
                                    <p>Size özel kaynak ve yöntem tavsiyeleri</p>
                                </div>
                            </div>
                        </div>

                        {/* Notify Section */}
                        <div className={styles.csActions}>
                            {submitState === "success" ? (
                                <div className={styles.successBox}>
                                    <div className={styles.successIcon}><CheckCircleIcon /></div>
                                    <p className={styles.successMsg}>{message}</p>
                                </div>
                            ) : (
                                <>
                                    {!showEmailForm ? (
                                        <button className={`btn btn-primary btn-glow ${styles.csNotifyBtn}`} onClick={() => setShowEmailForm(true)}>
                                            <BellIcon />
                                            <span>Hazır Olduğunda Haber Ver</span>
                                        </button>
                                    ) : (
                                        <div className={styles.emailFormWrapper}>
                                            <h4 className={styles.emailFormTitle}>
                                                <MailIcon />
                                                <span>E-posta adresinizi bırakın</span>
                                            </h4>
                                            <p className={styles.emailFormDesc}>Anket hazır olduğunda size ilk haber verelim.</p>
                                            <form className={styles.emailForm} onSubmit={handleSubscribe}>
                                                <div className={styles.emailInputWrapper}>
                                                    <input
                                                        type="email"
                                                        className={styles.emailInput}
                                                        placeholder="ornek@email.com"
                                                        value={email}
                                                        onChange={(e) => { setEmail(e.target.value); setSubmitState("idle"); setMessage(""); }}
                                                        autoFocus
                                                        required
                                                    />
                                                    <button type="submit" className={styles.emailSubmitBtn} disabled={submitState === "loading"}>
                                                        {submitState === "loading" ? (
                                                            <div className={styles.miniSpinner}></div>
                                                        ) : (
                                                            <SendIcon />
                                                        )}
                                                    </button>
                                                </div>
                                                {submitState === "error" && <p className={styles.errorMsg}>{message}</p>}
                                            </form>
                                        </div>
                                    )}
                                    <p className={styles.csNotifyHint}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                        İlk deneyenlerden olun
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
