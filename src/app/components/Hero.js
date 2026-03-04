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
                    <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className={styles.logoSvg}>
                        <defs>
                            <linearGradient id="heroGrad" x1="0" y1="0" x2="200" y2="200">
                                <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0ea5e9" />
                            </linearGradient>
                            <filter id="heroGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        </defs>
                        <circle cx="100" cy="100" r="90" fill="#0a1628" /><circle cx="100" cy="100" r="90" fill="url(#heroGrad)" opacity="0.1" />
                        <path d="M50 70 L50 140 L95 130 L95 60 Z" fill="#1e3a8a" opacity="0.6" />
                        <path d="M150 70 L150 140 L105 130 L105 60 Z" fill="#1e3a8a" opacity="0.6" />
                        <path d="M95 60 L100 55 L105 60 L105 130 L100 135 L95 130 Z" fill="url(#heroGrad)" className={styles.spine} />
                        <g stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" filter="url(#heroGlow)">
                            {[[60, 80, 85, 80], [60, 95, 85, 95], [60, 110, 85, 110]].map(([x1, y1, x2, y2], i) => <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.circuitLine} style={{ animationDelay: `${i * 0.3}s` }} />)}
                            {[[60, 80], [60, 95], [60, 110], [85, 80], [85, 95], [85, 110]].map(([cx, cy], i) => <circle key={`ln${i}`} cx={cx} cy={cy} r="3" fill="#22d3ee" className={styles.circuitNode} style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </g>
                        <g stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" filter="url(#heroGlow)">
                            {[[115, 80, 140, 80], [115, 95, 140, 95], [115, 110, 140, 110]].map(([x1, y1, x2, y2], i) => <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.circuitLine} style={{ animationDelay: `${i * 0.3 + 0.15}s` }} />)}
                            {[[115, 80], [115, 95], [115, 110], [140, 80], [140, 95], [140, 110]].map(([cx, cy], i) => <circle key={`rn${i}`} cx={cx} cy={cy} r="3" fill="#22d3ee" className={styles.circuitNode} style={{ animationDelay: `${i * 0.2 + 0.1}s` }} />)}
                        </g>
                        <g><rect x="93" y="88" width="14" height="14" rx="2" fill="#06b6d4" className={styles.aiChip} /><circle cx="100" cy="95" r="3.5" fill="#0a1628" /><line x1="93" y1="95" x2="85" y2="95" stroke="#22d3ee" strokeWidth="1.5" /><line x1="107" y1="95" x2="115" y2="95" stroke="#22d3ee" strokeWidth="1.5" /></g>
                        <path d="M50 70 L50 140 L95 130 L95 60 Z" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
                        <path d="M150 70 L150 140 L105 130 L105 60 Z" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.15" className={styles.pulseRing} />
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.1" className={styles.pulseRing} style={{ animationDelay: "1.5s" }} />
                    </svg>
                    <div className={styles.cardLabel}>LearnStyle AI</div>
                </div>
            </div>
        </section>
    );
}
