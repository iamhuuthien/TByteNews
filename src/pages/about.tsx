import React from 'react';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Me - TByteNews</title>
        <meta name="description" content="Information about the author of TByteNews" />
      </Head>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/">
            <span className={styles.navLink}>← Back to Home</span>
          </Link>
        </nav>
        <div className={styles.aboutSection}>
          <h1 className={styles.aboutTitle}>About Me</h1>
          <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
              <img
                src="/profile-image.jpg"
                alt="Profile"
                className={styles.profileImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
              <div>
                <h2 className={styles.profileName}>Your Name</h2>
                <h3 className={styles.profileTitle}>Software Engineer</h3>
              </div>
            </div>
            <div className={styles.profileBio}>
              <p>
                Hello, I'm a Software Engineer with a passion for web development and creating helpful digital experiences.
                I specialize in building modern web applications using React, Next.js, and various backend technologies.
              </p>
              <p>
                When I'm not coding, you can find me reading tech blogs, exploring new technologies, or creating content for my YouTube channel.
              </p>
            </div>
            <div className={styles.contactInfo}>
              <h3>Contact & Social Media</h3>
              <ul className={styles.socialList}>
                <li>
                  <strong>Email:</strong> <a href="mailto:your.email@example.com">your.email@example.com</a>
                </li>
                <li>
                  <strong>GitHub:</strong> <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">github.com/yourusername</a>
                </li>
                <li>
                  <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourusername</a>
                </li>
                <li>
                  <strong>YouTube (Chicky Tales):</strong> <a href="https://youtube.com/c/chickytales" target="_blank" rel="noopener noreferrer">youtube.com/c/chickytales</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;