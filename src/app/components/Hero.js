"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
    const statsRef = useRef(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !animatedRef.current) {
                    animatedRef.current = true;
                    document.querySelectorAll(`.${styles.statNumber}`).forEach((el) => {
                        const target = parseInt(el.dataset.target);
                        animateCount(el, 0, target, 2000);
                    });
                }
            });
        }, { threshold: 0.5 });
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    function animateCount(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        function update(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * eased);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <section className={styles.hero} id="home">
            <div className={styles.content}>
                <div className={`glass-badge ${styles.badge}`}>
                    <span className="badge-dot"></span>
                    <span>AI Destekli Öğrenme Platformu</span>
                </div>
                <h1 className={styles.title}>
                    <span className={styles.titleLine}>Öğrenme Stilinizi</span>
                    <span className={`${styles.titleLine} gradient-text`}>Keşfedin</span>
                    <span className={styles.titleLine}>AI ile <span className={styles.highlight}>Kişiselleştirin</span></span>
                </h1>
                <p className={styles.description}>
                    Yapay zeka destekli platformumuz, benzersiz öğrenme stilinizi analiz eder ve size özel
                    öğrenme yolları oluşturur. Daha hızlı, daha etkili ve daha keyifli öğrenin.
                </p>
                <div className={styles.actions}>
                    <button className="btn btn-primary btn-glow" onClick={() => scrollTo("survey")}>
                        <span>Öğrenme Stilimi Bul</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                    <button className="btn btn-glass" onClick={() => scrollTo("features")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        <span>Nasıl Çalışır?</span>
                    </button>
                </div>
                <div className={styles.stats} ref={statsRef}>
                    {[{ target: 4, label: "Öğrenme Stili" }, { target: 20, label: "Soruluk Anket" }].map((s) => (
                        <div key={s.label} className={`glass-stat ${styles.statItem}`}>
                            <span className={styles.statBadge}>Çok Yakında</span>
                            <span className={styles.statNumber} data-target={s.target}>0</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.visual}>
                <div className={styles.logoWrapper}>
                    <div className={`${styles.glowRing} ${styles.ring1}`}></div>
                    <div className={`${styles.glowRing} ${styles.ring2}`}></div>
                    <div className={styles.glowBg}></div>
                    <img
                        src="/LearnStyleAI-Logo-full-1024x1024.png"
                        alt="LearnStyle AI Branded Logo"
                        className={styles.logoSvg}
                        style={{ width: '280px', height: '280px', borderRadius: '22%', position: 'relative', zIndex: 10 }}
                    />
                    <div className={styles.cardLabel}>LearnStyle AI</div>
                </div>
            </div>
        </section>
    );
}
