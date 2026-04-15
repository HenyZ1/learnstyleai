"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "../components/PageStyles.module.css";

export default function LoginPage({ initialUser, accounts }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
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
                                    <p className={styles.panelEyebrow}>Oturum Acik</p>
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

                                <div className={styles.quickLinks}>
                                    <Link href="/ogrenme-stilini-bul" className={`btn btn-primary ${styles.backBtn}`}>
                                        Ankete Basla
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
