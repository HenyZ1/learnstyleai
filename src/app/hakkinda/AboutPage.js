"use client";
import styles from "../components/PageStyles.module.css";
import Image from "next/image";

const team = [
    { name: "AI Ekibi", role: "Yapay Zeka Geliştirme", bio: "Gelişmiş makine öğrenmesi modelleri ile kişiselleştirilmiş öğrenme algoritmaları geliştiriyoruz.", color: "rgba(168,85,247,0.12)", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg> },
    { name: "Eğitim Ekibi", role: "Pedagoji & İçerik", bio: "VARK modeli uzmanlarımız ile bilimsel temelli öğrenme içerikleri ve stratejiler tasarlıyoruz.", color: "rgba(6,182,212,0.12)", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
    { name: "Tasarım Ekibi", role: "UX/UI Tasarım", bio: "Modern ve erişilebilir arayüzler ile kullanıcı deneyimini en üst düzeye çıkarıyoruz.", color: "rgba(249,115,22,0.12)", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg> },
];

const values = [
    { title: "Erişilebilirlik", desc: "Herkes için eşit ve kaliteli eğitim fırsatları sunuyoruz.", color: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg> },
    { title: "İnovasyon", desc: "En son AI teknolojilerini eğitim alanına uyguluyoruz.", color: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
    { title: "Bilimsellik", desc: "Tüm stratejilerimiz bilimsel araştırmalara dayanmaktadır.", color: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> },
];

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <span className="glass-badge"><span className="badge-dot"></span>Hakkımızda</span>
                    <h1 className={styles.pageTitle}>Geleceğin Eğitimi <span className="gradient-text">Bugün Burada</span></h1>
                    <p className={styles.pageDesc}>LearnStyle AI, eğitim teknolojileri ve yapay zekanın gücünü birleştirerek her bireyin potansiyelini en üst düzeye çıkarmayı hedefler.</p>
                </div>

                {/* Mission */}
                <div className={`glass-card-large ${styles.aboutSection}`} style={{ padding: "48px", marginBottom: "48px" }}>
                    <h2 className={styles.aboutSectionTitle}>Misyonumuz</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, textAlign: "center", maxWidth: "700px", margin: "0 auto", fontSize: "1.05rem" }}>
                        VARK öğrenme modeli ve gelişmiş AI algoritmaları ile kişiselleştirilmiş öğrenme deneyimi sunuyoruz.
                        Her öğrenci benzersizdir ve hak ettikleri özel ilgiyi yapay zeka teknolojimizle sağlıyoruz.
                        Amacımız, eğitimi daha erişilebilir, etkili ve keyifli hale getirmektir.
                    </p>
                </div>

                {/* Team */}
                <div className={styles.aboutSection}>
                    <h2 className={styles.aboutSectionTitle}>Ekibimiz</h2>
                    <div className={styles.teamGrid}>
                        {team.map((t, i) => (
                            <div key={i} className={`glass-card-premium ${styles.teamCard}`}>
                                <div className={styles.teamAvatar} style={{ background: t.color }}>{t.icon}</div>
                                <h4 className={styles.teamName}>{t.name}</h4>
                                <p className={styles.teamRole}>{t.role}</p>
                                <p className={styles.teamBio}>{t.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div className={styles.aboutSection}>
                    <h2 className={styles.aboutSectionTitle}>Değerlerimiz</h2>
                    <div className={styles.valueGrid}>
                        {values.map((v, i) => (
                            <div key={i} className={`glass-card ${styles.valueCard}`}>
                                <div className={styles.valueIcon} style={{ background: v.color, border: `1px solid ${v.border}` }}>{v.icon}</div>
                                <h4 className={styles.valueTitle}>{v.title}</h4>
                                <p className={styles.valueDesc}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
