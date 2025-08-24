import React from 'react';
import styles from '../../styles/main.module.css';

const LoadingSpinner: React.FC = () => (
  <div className={styles.loadingSpinnerWrapper}>
    <div className={styles.loadingSpinner}></div>
  </div>
);

export default LoadingSpinner;