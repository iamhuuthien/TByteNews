import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/layout.module.css';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    try {
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>TByteNews</a>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" legacyBehavior>
            <a className={router.pathname === '/' ? styles.activeLink : styles.navLink} aria-current={router.pathname === '/' ? 'page' : undefined}>Home</a>
          </Link>

          <Link href="/about" legacyBehavior>
            <a className={router.pathname === '/about' ? styles.activeLink : styles.navLink} aria-current={router.pathname === '/about' ? 'page' : undefined}>About</a>
          </Link>

          <button onClick={toggleTheme} className={styles.themeToggle} aria-pressed={isDarkMode}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;