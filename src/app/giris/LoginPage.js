"use client";
import Link from "next/link";
import styles from "../components/PageStyles.module.css";

export default function LoginPage() {
    return (
        <div className={styles.comingSoonPage}>
            <div className={`glass-card-large ${styles.comingSoonBox}`}>
                {/* Animated Icon */}
                <div className={styles.csIcon}>
                    <div className={`${styles.csIconRing} ${styles.ring1}`}></div>
                    <div className={`${styles.csIconRing} ${styles.ring2}`}></div>
                    <div className={`${styles.csIconRing} ${styles.ring3}`}></div>
                    <div className={styles.csIconInner}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#loginGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="50%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                </div>

                {/* Tag */}
                <div className={styles.csTag}>
                    <span className={styles.csTagDot}></span>
                    Çok Yakında
                </div>

                {/* Content */}
                <h1 className={styles.csTitle}>
                    Giriş Sistemi
                    <br />
                    <span className={styles.csGlow}>Yakında Sizlerle!</span>
                </h1>
                <p className={styles.csDesc}>
                    Kişiselleştirilmiş öğrenme deneyiminizi daha da ileriye taşımak için <strong style={{ color: "var(--text-primary)" }}>kullanıcı hesap sistemi</strong> üzerinde çalışıyoruz.
                    Hesabınızla giriş yaparak ilerlemenizi kaydedin, AI önerilerini kişiselleştirin ve daha fazlasını keşfedin.
                </p>

                {/* Actions */}
                <div className={styles.csActions}>
                    <Link href="/" className={`btn btn-primary btn-glow ${styles.backBtn}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        <span>Ana Sayfaya Dön</span>
                    </Link>
                    <Link href="/ozellikler" className={`btn btn-glass ${styles.backBtn}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <span>Özellikleri Keşfet</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
