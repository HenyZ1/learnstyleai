"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Logo from "./Logo";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [sessionUser, setSessionUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let active = true;

        const loadSession = async () => {
            try {
                const response = await fetch("/api/auth/session", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (active) {
                    setSessionUser(data.user || null);
                }
            } catch {
                if (active) {
                    setSessionUser(null);
                }
            }
        };

        loadSession();

        return () => {
            active = false;
        };
    }, [pathname]);

    const links = [
        { href: "/", label: "Ana Sayfa" },
        { href: "/ozellikler", label: "Özellikler" },
        { href: "/ogrenme-stilini-bul", label: "Öğrenme Stilini Bul" },
        { href: "/hakkinda", label: "Hakkında" },
        { href: "/profil", label: "Profil" },
    ];
    const loginLabel = sessionUser ? sessionUser.name : "Giris Yap";

    return (
        <>
            <nav className={`${styles.navbar} glass-nav ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.navLogo}>
                        <Logo size={36} />
                        <span className={styles.logoText}>LearnStyle<span className={styles.logoAi}>AI</span></span>
                    </Link>
                    <div className={styles.navLinks}>
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} className={`${styles.navLink} ${pathname === l.href ? styles.active : ""}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                    <div className={styles.navActions}>
                        <Link href="/giris" className={`btn btn-primary ${styles.loginBtn}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            <span>{loginLabel}</span>
                        </Link>
                        <button className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className={`${styles.mobileMenu} glass-panel ${menuOpen ? styles.active : ""}`}>
                {links.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        {l.label}
                    </Link>
                ))}
                <Link href="/giris" className={`${styles.mobileLink} ${styles.mobileLogin}`} onClick={() => setMenuOpen(false)}>
                    {loginLabel}
                </Link>
            </div>
        </>
    );
}
