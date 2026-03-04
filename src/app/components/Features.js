"use client";
import styles from "./Sections.module.css";

const features = [
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><line x1="9" y1="21" x2="15" y2="21" /><line x1="10" y1="24" x2="14" y2="24" /></svg>,
        title: "Akıllı Analiz",
        desc: "AI algoritmalarımız öğrenme davranışlarınızı analiz ederek size en uygun öğrenme stratejisini belirler.",
        color: "purple"
    },
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        title: "Kişisel Yolculuk",
        desc: "Her birey benzersizdir. Sizin öğrenme hızınıza ve stilinize uygun içerikler sunuyoruz.",
        color: "violet"
    },
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="12" cy="10" r="1" fill="currentColor" /><circle cx="8" cy="10" r="1" fill="currentColor" /><circle cx="16" cy="10" r="1" fill="currentColor" /></svg>,
        title: "AI Asistan",
        desc: "7/24 erişilebilir AI chatbot ile sorularınızı anında yanıtlayın ve öğrenmenizi hızlandırın.",
        color: "cyan"
    },
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
        title: "İlerleme Takibi",
        desc: "Detaylı analitik gösterge paneli ile öğrenme ilerlemenizi gerçek zamanlı takip edin.",
        color: "pink"
    },
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
        title: "Çoklu Platform",
        desc: "Masaüstü, tablet ve mobil cihazlardan kesintisiz öğrenme deneyimi yaşayın.",
        color: "orange"
    },
    {
        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>,
        title: "Güvenli & Gizli",
        desc: "Verileriniz en yüksek güvenlik standartlarıyla korunur. Gizliliğiniz bizim önceliğimiz.",
        color: "green"
    },
];

export default function Features() {
    return (
        <section className={styles.section} id="features">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className="glass-badge"><span className="badge-dot"></span>Özellikler</span>
                    <h2 className={styles.sectionTitle}>Neden <span className="gradient-text">LearnStyle AI?</span></h2>
                    <p className={styles.sectionDesc}>En son yapay zeka teknolojileri ile öğrenme deneyiminizi dönüştürüyoruz.</p>
                </div>
                <div className={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <div key={i} className={`glass-card ${styles.featureCard}`}>
                            <div className={`${styles.featureIcon} ${styles[f.color]}`}>{f.icon}</div>
                            <h3 className={styles.featureTitle}>{f.title}</h3>
                            <p className={styles.featureDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
