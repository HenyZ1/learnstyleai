"use client";
import styles from "./Sections.module.css";
import Image from "next/image";

export default function About() {
    return (
        <section className={styles.section} id="about">
            <div className={styles.container}>
                <div className={styles.aboutGrid}>
                    <div className={styles.aboutContent}>
                        <span className="glass-badge"><span className="badge-dot"></span>Hakkında</span>
                        <h2 className={`${styles.sectionTitle} ${styles.aboutTitle}`}>Geleceğin Eğitimi <span className="gradient-text">Bugün Burada</span></h2>
                        <p className={styles.aboutText}>
                            LearnStyle AI, eğitim teknolojileri ve yapay zekanın gücünü birleştirerek her bireyin potansiyelini en üst düzeye çıkarmayı hedefler.
                        </p>
                        <p className={styles.aboutText}>
                            VARK öğrenme modeli ve gelişmiş AI algoritmaları ile kişiselleştirilmiş öğrenme deneyimi sunuyoruz. Her öğrenci benzersizdir ve hak ettikleri özel ilgiyi AI teknolojimizle sağlıyoruz.
                        </p>
                        <div className={styles.aboutFeatures}>
                            {[
                                "VARK Öğrenme Modeli",
                                "Gelişmiş AI Algoritmaları",
                                "Kişiselleştirilmiş İçerik",
                                "Gerçek Zamanlı Geri Bildirim",
                            ].map((f) => (
                                <div key={f} className={styles.aboutFeature}>
                                    <div className={styles.aboutFeatureIcon}>✦</div>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.aboutImageWrapper}>
                        <div className="glass-card" style={{ padding: "24px" }}>
                            <Image src="/learning-styles.png" alt="Öğrenme Stilleri" width={400} height={400} className={styles.aboutImage} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
