"use client";
import { useState } from "react";
import styles from "./AdaptiveLearning.module.css";

const learningPaths = [
    {
        id: "visual",
        title: "Görsel Öğrenici",
        subtitle: "Visual Learner",
        color: "#a855f7",
        colorBg: "rgba(168,85,247,0.08)",
        colorBorder: "rgba(168,85,247,0.2)",
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
        recommendations: [
            { type: "Video İçerikler", desc: "Animasyonlu ders videoları ve görsel anlatımlar", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg> },
            { type: "İnfografikler", desc: "Bilgiyi görsel ve renkli şemalarla öğrenme", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg> },
            { type: "Zihin Haritaları", desc: "Kavramları görsel ağlar ile ilişkilendirme", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" /><line x1="9.5" y1="10" x2="5.5" y2="7.5" /><line x1="14.5" y1="10" x2="18.5" y2="7.5" /><line x1="9.5" y1="14" x2="5.5" y2="16.5" /><line x1="14.5" y1="14" x2="18.5" y2="16.5" /></svg> },
        ]
    },
    {
        id: "auditory",
        title: "İşitsel Öğrenici",
        subtitle: "Auditory Learner",
        color: "#06b6d4",
        colorBg: "rgba(6,182,212,0.08)",
        colorBorder: "rgba(6,182,212,0.2)",
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>,
        recommendations: [
            { type: "Podcast Serileri", desc: "Konu bazlı sesli anlatımlar ve tartışmalar", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg> },
            { type: "Sesli Dersler", desc: "Öğretici sesli anlatımlar ve ders kayıtları", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="15.5" r="2.5" /><path d="M8 17V5l12-2v12" /></svg> },
            { type: "Tartışma Grupları", desc: "Etkileşimli sohbet ve fikir alışverişi", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
        ]
    },
    {
        id: "readwrite",
        title: "Okuma/Yazma Öğrenici",
        subtitle: "Reading Learner",
        color: "#6366f1",
        colorBg: "rgba(99,102,241,0.08)",
        colorBorder: "rgba(99,102,241,0.2)",
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
        recommendations: [
            { type: "Makaleler & Yazılar", desc: "Derinlemesine akademik ve blog yazıları", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
            { type: "Not & Özet Araçları", desc: "Yapılandırılmış not tutma ve özet çıkarma", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg> },
            { type: "E-Kitaplar", desc: "Kapsamlı dijital kitaplar ve referans kaynakları", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
        ]
    },
    {
        id: "kinesthetic",
        title: "Kinestetik Öğrenici",
        subtitle: "Kinesthetic Learner",
        color: "#f97316",
        colorBg: "rgba(249,115,22,0.08)",
        colorBorder: "rgba(249,115,22,0.2)",
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
        recommendations: [
            { type: "İnteraktif Alıştırmalar", desc: "Uygulamalı quizler ve pratik problemler", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
            { type: "Simülasyonlar", desc: "Gerçek dünya senaryoları ile öğrenme", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            { type: "Proje Tabanlı Öğrenme", desc: "Gerçek projeler ile yaparak keşfetme", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
        ]
    },
];

export default function AdaptiveLearning() {
    const [activeTab, setActiveTab] = useState("visual");
    const activeData = learningPaths.find((p) => p.id === activeTab);

    return (
        <section className={styles.section} id="adaptive">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className="glass-badge"><span className="badge-dot"></span>Adaptive Learning</span>
                    <h2 className={styles.title}>AI Size <span className="gradient-text">Ne Önerir?</span></h2>
                    <p className={styles.desc}>LearnStyle AI sadece öğrenme stilinizi bulmaz — size özel içerik ve stratejiler önerir. Her öğrenme stiline göre kişiselleştirilmiş öğrenme yolları sunar.</p>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {learningPaths.map((p) => (
                        <button
                            key={p.id}
                            className={`${styles.tab} ${activeTab === p.id ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(p.id)}
                            style={activeTab === p.id ? { borderColor: p.color, color: p.color } : {}}
                        >
                            <span className={styles.tabIcon} style={activeTab === p.id ? { background: p.colorBg, borderColor: p.colorBorder } : {}}>{p.icon}</span>
                            <span className={styles.tabLabel}>{p.title}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={styles.content} key={activeTab}>
                    <div className={styles.contentHeader}>
                        <div className={styles.contentIcon} style={{ background: activeData.colorBg, border: `1px solid ${activeData.colorBorder}`, color: activeData.color }}>{activeData.icon}</div>
                        <div>
                            <h3 className={styles.contentTitle} style={{ color: activeData.color }}>{activeData.title}</h3>
                            <p className={styles.contentSubtitle}>{activeData.subtitle}</p>
                        </div>
                    </div>

                    <div className={styles.recommendations}>
                        {activeData.recommendations.map((r, i) => (
                            <div key={i} className={`glass-card ${styles.recCard}`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={styles.recIcon} style={{ background: activeData.colorBg, border: `1px solid ${activeData.colorBorder}`, color: activeData.color }}>{r.icon}</div>
                                <div className={styles.recInfo}>
                                    <h4 className={styles.recTitle}>{r.type}</h4>
                                    <p className={styles.recDesc}>{r.desc}</p>
                                </div>
                                <div className={styles.recArrow} style={{ color: activeData.color }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.aiNote}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg>
                        <span>AI motorumuz, analiz sonuçlarınıza göre bu önerileri otomatik olarak kişiselleştirir.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
