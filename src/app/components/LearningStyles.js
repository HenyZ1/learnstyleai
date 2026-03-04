"use client";
import styles from "./Sections.module.css";

const learningStyles = [
    {
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
        title: "Görsel Öğrenme",
        desc: "Grafikler, diyagramlar, renkler ve görsel düzenlemeler ile en iyi öğrenirsiniz.",
        traits: ["Zihin haritaları tercih eder", "Renkli notlar alır", "Görsel hafızası güçlüdür"],
        color: "purple"
    },
    {
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>,
        title: "İşitsel Öğrenme",
        desc: "Dinleyerek, tartışarak ve sesli tekrar yaparak en iyi öğrenirsiniz.",
        traits: ["Sesli ders dinler", "Tartışmayı sever", "Müzikle çalışır"],
        color: "cyan"
    },
    {
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
        title: "Okuma/Yazma",
        desc: "Metin tabanlı materyaller, notlar ve yazılı açıklamalarla en iyi öğrenirsiniz.",
        traits: ["Çok okur ve not alır", "Listeler oluşturur", "Yazıyı sever"],
        color: "indigo"
    },
    {
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
        title: "Kinestetik",
        desc: "Yaparak, dokunarak ve deneyimleyerek en iyi öğrenirsiniz.",
        traits: ["Pratik yapmayı sever", "Hareket halinde öğrenir", "Deney yapmaktan hoşlanır"],
        color: "orange"
    },
];

export default function LearningStyles() {
    return (
        <section className={styles.section} id="styles">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className="glass-badge"><span className="badge-dot"></span>Öğrenme Stilleri</span>
                    <h2 className={styles.sectionTitle}>4 Temel <span className="gradient-text">Öğrenme Stili</span></h2>
                    <p className={styles.sectionDesc}>VARK modeline göre herkesin kendine özgü bir öğrenme stili vardır.</p>
                </div>
                <div className={styles.stylesGrid}>
                    {learningStyles.map((s, i) => (
                        <div key={i} className={`glass-card-premium ${styles.styleCard}`}>
                            <div className={`${styles.styleIcon} ${styles[s.color]}`}>{s.icon}</div>
                            <h3 className={styles.styleTitle}>{s.title}</h3>
                            <p className={styles.styleDesc}>{s.desc}</p>
                            <ul className={styles.traits}>
                                {s.traits.map((t, j) => (
                                    <li key={j}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
