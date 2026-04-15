"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "../components/PageStyles.module.css";

export default function LoginPage({ initialUser, initialDashboardProfile, accounts }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [dashboardProfile, setDashboardProfile] = useState(initialDashboardProfile);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const welcomeText = useMemo(() => {
        if (!user) {
            return "Deniz Hoca ve ogrenciler icin iki demo hesap hazir. Sisteme girip anket, AI yorum ve chat akisini kullanabilirsiniz.";
        }

        if (user.role === "teacher") {
            return "Egitmen oturumu aktif. Anket sonuclarini, AI yorumlarini ve platform deneyimini ogretmen bakisiyla test edebilirsiniz.";
        }

        return "Ogrenci oturumu aktif. Anketi doldurup AI destekli yorumlari ve chat asistanini ogrenci akisi icinde test edebilirsiniz.";
    }, [user]);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    useEffect(() => {
        setDashboardProfile(initialDashboardProfile || null);
    }, [initialDashboardProfile]);

    const formattedCompletedAt = useMemo(() => {
        if (!dashboardProfile?.completedAt) {
            return "";
        }

        return new Date(dashboardProfile.completedAt).toLocaleString("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }, [dashboardProfile]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Giris yapilamadi.");
            }

            setUser(data.user);
            setDashboardProfile(null);
            setPassword("");
            router.refresh();
        } catch (submitError) {
            setError(
                submitError instanceof Error && submitError.message
                    ? submitError.message
                    : "Giris yapilirken beklenmeyen bir hata olustu."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError("");

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
            setUser(null);
            setDashboardProfile(null);
            setEmail("");
            setPassword("");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                <div className={styles.loginShell}>
                    <div className={`glass-card-large ${styles.loginHero}`}>
                        <div className={styles.loginBadge}>
                            <span className={styles.csTagDot}></span>
                            Demo Giris Aktif
                        </div>
                        <h1 className={styles.loginTitle}>
                            LearnStyle AI icin
                            <br />
                            <span className={styles.csGlow}>hazir iki hesap</span>
                        </h1>
                        <p className={styles.loginDesc}>{welcomeText}</p>

                        <div className={styles.accountGrid}>
                            {accounts.map((account) => (
                                <div key={account.id} className={`glass-card ${styles.accountCard}`}>
                                    <div className={styles.accountTop}>
                                        <div>
                                            <p className={styles.accountRole}>{account.roleLabel}</p>
                                            <h3 className={styles.accountName}>{account.name}</h3>
                                        </div>
                                        <span className={styles.accountBadge}>{account.role === "teacher" ? "Deneme" : "Paylasimli"}</span>
                                    </div>
                                    <p className={styles.accountEmail}>{account.email}</p>
                                    <p className={styles.accountSummary}>{account.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`glass-card-large ${styles.loginPanel}`}>
                        {!user ? (
                            <>
                                <div className={styles.panelHeader}>
                                    <p className={styles.panelEyebrow}>Giris</p>
                                    <h2 className={styles.panelTitle}>Hesabiniza giris yapin</h2>
                                    <p className={styles.panelDesc}>
                                        Demo hesaplardan biriyle giris yaparak sayfa akisini aktif kullanabilirsiniz.
                                    </p>
                                </div>

                                <form className={styles.loginForm} onSubmit={handleSubmit}>
                                    <label className={styles.fieldBlock}>
                                        <span>E-posta</span>
                                        <input
                                            className={styles.input}
                                            type="email"
                                            autoComplete="username"
                                            placeholder="ornek@learnstyle.ai"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                        />
                                    </label>

                                    <label className={styles.fieldBlock}>
                                        <span>Sifre</span>
                                        <input
                                            className={styles.input}
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Sifrenizi girin"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            required
                                        />
                                    </label>

                                    {error ? <div className={styles.loginError}>{error}</div> : null}

                                    <button type="submit" className={`btn btn-primary btn-glow ${styles.loginSubmit}`} disabled={loading}>
                                        {loading ? "Giris yapiliyor..." : "Giris Yap"}
                                    </button>
                                </form>

                                <div className={styles.loginActions}>
                                    <Link href="/ogrenme-stilini-bul" className={`btn btn-glass ${styles.backBtn}`}>
                                        Ankete Git
                                    </Link>
                                    <Link href="/" className={`btn btn-glass ${styles.backBtn}`}>
                                        Ana Sayfa
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.panelHeader}>
                                    <p className={styles.panelEyebrow}>Dashboard</p>
                                    <h2 className={styles.panelTitle}>{user.name}</h2>
                                    <p className={styles.panelDesc}>
                                        {user.roleLabel} hesabi aktif. E-posta: <strong>{user.email}</strong>
                                    </p>
                                </div>

                                <div className={styles.sessionCard}>
                                    <div className={styles.sessionRow}>
                                        <span>Rol</span>
                                        <strong>{user.roleLabel}</strong>
                                    </div>
                                    <div className={styles.sessionRow}>
                                        <span>AI Chat</span>
                                        <strong>Aktif</strong>
                                    </div>
                                    <div className={styles.sessionRow}>
                                        <span>VARK Anketi</span>
                                        <strong>Aktif</strong>
                                    </div>
                                    <div className={styles.sessionRow}>
                                        <span>ML Analizi</span>
                                        <strong>Aktif</strong>
                                    </div>
                                </div>

                                <div className={`glass-card ${styles.dashboardCard}`}>
                                    <div className={styles.dashboardHeader}>
                                        <div>
                                            <p className={styles.panelEyebrow}>Son Anket Sonucu</p>
                                            <h3 className={styles.dashboardTitle}>
                                                {dashboardProfile?.dominantStyle
                                                    ? `${dashboardProfile.dominantStyle.icon} ${dashboardProfile.dominantStyle.label}`
                                                    : "Henuz anket sonucu yok"}
                                            </h3>
                                        </div>
                                        {dashboardProfile?.dominantStyle ? (
                                            <span
                                                className={styles.dashboardBadge}
                                                style={{
                                                    background: `${dashboardProfile.dominantStyle.color}22`,
                                                    color: dashboardProfile.dominantStyle.color,
                                                }}
                                            >
                                                %{dashboardProfile.dominantStyle.percentage}
                                            </span>
                                        ) : null}
                                    </div>

                                    {dashboardProfile ? (
                                        <>
                                            <p className={styles.dashboardSummary}>{dashboardProfile.blendSummary}</p>

                                            <div className={styles.dashboardMetrics}>
                                                <span className={styles.dashboardMetric}>
                                                    AI: {dashboardProfile.analysisSource === "ai" ? "OpenAI" : "Fallback"}
                                                </span>
                                                {dashboardProfile.mlPrediction ? (
                                                    <span className={styles.dashboardMetric}>
                                                        ML: {dashboardProfile.mlPrediction.predictedStyleLabel} %{
                                                            dashboardProfile.mlPrediction.confidencePercent
                                                        }
                                                    </span>
                                                ) : null}
                                                {formattedCompletedAt ? (
                                                    <span className={styles.dashboardMetric}>
                                                        Guncellendi: {formattedCompletedAt}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className={styles.dashboardScoreList}>
                                                {dashboardProfile.rankedStyles.map((style) => (
                                                    <div key={style.key} className={styles.dashboardScoreRow}>
                                                        <div className={styles.dashboardScoreHeader}>
                                                            <span>
                                                                {style.icon} {style.label}
                                                            </span>
                                                            <strong>{style.score}/20</strong>
                                                        </div>
                                                        <div className={styles.dashboardScoreTrack}>
                                                            <div
                                                                className={styles.dashboardScoreFill}
                                                                style={{
                                                                    width: `${style.percentage}%`,
                                                                    background: style.color,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {dashboardProfile.analysisPreview ? (
                                                <p className={styles.dashboardPreview}>{dashboardProfile.analysisPreview}</p>
                                            ) : null}

                                            {dashboardProfile.recommendedTips?.length ? (
                                                <ul className={styles.dashboardTipList}>
                                                    {dashboardProfile.recommendedTips.slice(0, 3).map((tip) => (
                                                        <li key={tip}>{tip}</li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </>
                                    ) : (
                                        <div className={styles.dashboardEmpty}>
                                            <p>
                                                Bu hesap icin kayitli anket sonucu bulunmuyor. Giris yaptiktan sonra anketi
                                                tamamladiginizda sonuc burada otomatik gorunecek.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.quickLinks}>
                                    <Link href="/ogrenme-stilini-bul" className={`btn btn-primary ${styles.backBtn}`}>
                                        {dashboardProfile ? "Anketi Guncelle" : "Ankete Basla"}
                                    </Link>
                                    <Link href="/ozellikler" className={`btn btn-glass ${styles.backBtn}`}>
                                        Ozellikler
                                    </Link>
                                </div>

                                <button type="button" className={`btn btn-glass ${styles.logoutButton}`} onClick={handleLogout} disabled={loading}>
                                    {loading ? "Cikis yapiliyor..." : "Cikis Yap"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
