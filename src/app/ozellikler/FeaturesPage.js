"use client";
import styles from "../components/PageStyles.module.css";

const features = [
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><line x1="9" y1="21" x2="15" y2="21" /></svg>, title: "AI ile Akıllı Analiz", desc: "Yapay zeka algoritmalarımız öğrenme davranışlarınızı derinlemesine analiz ederek size en uygun öğrenme stratejisini belirler.", color: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", items: ["VARK modeli tabanlı analiz", "Davranış kalıpları tespiti", "Gerçek zamanlı değerlendirme", "Kişiselleştirilmiş raporlama"] },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, title: "Kişiselleştirilmiş Yolculuk", desc: "Her birey benzersizdir. Sizin öğrenme hızınıza, stilinize ve hedeflerinize uygun içerikler ve stratejiler sunuyoruz.", color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)", items: ["Adaptif öğrenme yolları", "Dinamik içerik önerileri", "Bireysel tempo ayarlama", "Hedef bazlı ilerleme"] },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, title: "7/24 AI Asistan", desc: "AI chatbot ile sorularınızı anında yanıtlayın. Öğrenme stratejileri, çalışma teknikleri ve daha fazlası hakkında rehberlik alın.", color: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)", items: ["Anlık soru-cevap", "Öğrenme tavsiyeleri", "Stres yönetimi desteği", "Çalışma planı önerileri"] },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, title: "Detaylı İlerleme Takibi", desc: "Gösterge paneliyle öğrenme ilerlemenizi gerçek zamanlı takip edin. Güçlü ve geliştirilmesi gereken alanları görün.", color: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)", items: ["Gerçek zamanlı analitik", "Haftalık performans raporu", "Trend analizi", "Başarı istatistikleri"] },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>, title: "Çoklu Platform Desteği", desc: "Masaüstü, tablet ve mobil cihazlardan kesintisiz öğrenme. Verileriniz tüm cihazlarda senkronize.", color: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)", items: ["Responsive tasarım", "Cihazlar arası senkronizasyon", "Offline erişim", "PWA desteği"] },
    { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: "Güvenlik & Gizlilik", desc: "Verileriniz en yüksek güvenlik standartlarıyla korunur. KVKK uyumlu altyapımızla gizliliğiniz garanti altında.", color: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", items: ["End-to-end şifreleme", "KVKK uyumu", "Veri minimize etme", "Güvenlik denetimleri"] },
];

export default function FeaturesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <span className="glass-badge"><span className="badge-dot"></span>Özellikler</span>
                    <h1 className={styles.pageTitle}>Neden <span className="gradient-text">LearnStyle AI?</span></h1>
                    <p className={styles.pageDesc}>En son yapay zeka teknolojileri ile öğrenme deneyiminizi kökten dönüştürüyoruz. İşte size sunduğumuz özellikler.</p>
                </div>
                <div className={styles.detailGrid}>
                    {features.map((f, i) => (
                        <div key={i} className={`glass-card-premium ${styles.detailCard}`}>
                            <div className={styles.detailCardIcon} style={{ background: f.color, border: `1px solid ${f.border}` }}>{f.icon}</div>
                            <h3 className={styles.detailCardTitle}>{f.title}</h3>
                            <p className={styles.detailCardDesc}>{f.desc}</p>
                            <ul className={styles.detailCardList}>
                                {f.items.map((item, j) => (
                                    <li key={j}>
                                        <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
