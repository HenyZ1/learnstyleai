"use client";
import styles from "./Sections.module.css";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerGrid}>
                    <div>
                        <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
                            <Logo size={32} />
                            <span style={{ fontFamily: "var(--font-primary)", fontSize: "1.35rem", fontWeight: 700 }}>
                                LearnStyle<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>AI</span>
                            </span>
                        </a>
                        <p className={styles.footerDesc}>AI ile kişiselleştirilmiş öğrenme deneyimi. Öğrenme stilinizi keşfedin, potansiyelinizi açığa çıkarın.</p>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>Platform</h4>
                        <a href="#features">Özellikler</a>
                        <a href="#styles">Öğrenme Stilleri</a>
                        <a href="#survey">Anket</a>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>Kaynaklar</h4>
                        <a href="#">Blog</a>
                        <a href="#">Dökümanlar</a>
                        <a href="#">SSS</a>
                    </div>
                    <div className={styles.footerGroup}>
                        <h4>İletişim</h4>
                        <a href="#">info@learnstyleai.com</a>
                        <a href="#">Twitter</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2026 LearnStyle AI. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
