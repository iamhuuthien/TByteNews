import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/layout.module.css';
import Icon from '../ui/Icon';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('dark-mode', isDark);
    }

    // scroll handler: add .scrolled to nav when user scrolls down
    const handleScroll = () => {
      if (!navRef.current) return;
      const y = window.scrollY || window.pageYOffset;
      navRef.current.classList.toggle('scrolled', y > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('dark-mode', newIsDark);
    }
    try { localStorage.setItem('theme', newIsDark ? 'dark' : 'light'); } catch {}
  };

  return (
    <nav ref={navRef} className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>TByteNews</a>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" legacyBehavior>
            <a className={router.pathname === '/' ? styles.activeLink : styles.navLink}>Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className={router.pathname === '/about' ? styles.activeLink : styles.navLink}>About</a>
          </Link>

          <button onClick={toggleTheme} className={styles.themeToggle} aria-pressed={isDarkMode} aria-label="Toggle theme">
            <Icon icon={isDarkMode ? Sun : Moon} size={16} />
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;