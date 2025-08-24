import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/layout.module.css';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/">
          <div className={styles.logo}>TByteNews</div>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">
            <span className={router.pathname === '/' ? styles.activeLink : styles.navLink}>Home</span>
          </Link>
          <Link href="/about">
            <span className={router.pathname === '/about' ? styles.activeLink : styles.navLink}>About</span>
          </Link>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;