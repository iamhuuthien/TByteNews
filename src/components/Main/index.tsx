import React from 'react';
import styles from '../../styles/main.module.css'; 

const Main: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Welcome to TByte News</h1>
            <div className={styles.postsGrid}>
                {/* Here you would map through your posts and display them in a card/grid format */}
            </div>
        </div>
    );
};

export default Main;