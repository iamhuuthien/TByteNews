import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import styles from '../../styles/layout.module.css';

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  hideNavbar = false,
  hideFooter = false
}) => {
  return (
    <div className={styles.layout}>
      {!hideNavbar && <Navbar />}
      <main className={styles.main}>{children}</main>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;