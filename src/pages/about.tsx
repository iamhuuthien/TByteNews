import React, { useEffect, useState } from 'react';
import styles from '../styles/main.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { getAdminProfile } from '../utils/fetchAdminProfile';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const AboutPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProfile()
      .then(data => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>About Me - TByteNews</title>
        <meta name="description" content="Information about the author of TByteNews" />
      </Head>
      <div className={styles.container}>
        <nav>
          <Link href="/">
            <span className={styles.navLink}>← Back to Home</span>
          </Link>
        </nav>
        <div className={styles.aboutSection}>
          <h1 className={styles.aboutTitle}>About Me</h1>
          {loading ? (
            <LoadingSpinner />
          ) : profile ? (
            <div className={styles.profileSection}>
              <div className={styles.profileHeader}>
                <img
                  src={profile.avatar_url || '/profile-image.jpg'}
                  alt="Profile"
                  className={styles.profileImage}
                  style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', background: '#eee', marginRight: 24 }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/120";
                  }}
                />
                <div>
                  <h2 className={styles.profileName}>{profile.name}</h2>
                  <h3 className={styles.profileTitle}>{profile.job_title}</h3>
                </div>
              </div>
              {profile.bio && (
                <div className={styles.profileBio}>
                  <p>{profile.bio}</p>
                </div>
              )}
              <div className={styles.contactInfo}>
                <h3>Contact & Social Media</h3>
                <ul className={styles.socialList}>
                  <li>
                    <strong>Email:</strong>{' '}
                    {profile.email ? (
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    ) : 'Chưa cập nhật'}
                  </li>
                  <li>
                    <strong>GitHub:</strong>{' '}
                    {profile.github ? (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a>
                    ) : 'Chưa cập nhật'}
                  </li>
                  <li>
                    <strong>LinkedIn:</strong>{' '}
                    {profile.linkedin ? (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a>
                    ) : 'Chưa cập nhật'}
                  </li>
                  <li>
                    <strong>YouTube:</strong>{' '}
                    {profile.youtube ? (
                      <a href={profile.youtube} target="_blank" rel="noopener noreferrer">{profile.youtube}</a>
                    ) : 'Chưa cập nhật'}
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.loading}>Không tìm thấy thông tin admin.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AboutPage;