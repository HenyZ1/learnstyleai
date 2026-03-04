"use client";
import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Yukarı çık"
            style={{
                position: "fixed", bottom: 32, left: 32, zIndex: 998,
                width: 44, height: 44, borderRadius: "var(--radius-md)",
                background: "var(--glass-bg)", backdropFilter: "blur(10px)",
                border: "1px solid var(--glass-border)", color: "var(--text-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.4s",
            }}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}
