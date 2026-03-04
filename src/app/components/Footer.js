"use client";
import styles from "./Sections.module.css";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerGrid}>
                    <div>
                        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
                            <Logo size={32} />
                            <span style={{ fontFamily: "var(--font-primary)", fontSize: "1.35rem", fontWeight: 700 }}>
                                LearnStyle<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>AI</span>
                            </span>
                        </Link>
                        <p className={styles.footerDesc}>AI ile kişiselleştirilmiş öğrenme deneyimi. Öğrenme stilinizi keşfedin, potansiyelinizi açığa çıkarın.</p>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>Platform</h4>
                        <Link href="/ozellikler">Özellikler</Link>
                        <Link href="/ogrenme-stilini-bul">Öğrenme Stilini Bul</Link>
                        <Link href="/hakkinda">Hakkında</Link>
                        <Link href="/">Ana Sayfa</Link>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>Kaynaklar</h4>
                        <Link href="/ozellikler">Nasıl Çalışır?</Link>
                        <Link href="/hakkinda">Ekibimiz</Link>
                        <Link href="/giris">SSS</Link>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>İletişim</h4>
                        <a href="mailto:info@learnstyleai.com">info@learnstyleai.com</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2026 LearnStyle AI. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
