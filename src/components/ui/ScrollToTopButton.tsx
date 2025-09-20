import React from 'react';
import styles from '../../styles/scrollTop.module.css';
import useScrollTop from '../../hooks/useScrollTop';
import Icon from './Icon';
import { ChevronsUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const { visible, scrollToTop } = useScrollTop(220);

  if (!visible) return null;

  return (
    <button
      className={styles.scrollBtn}
      onClick={() => scrollToTop()}
      aria-label="Scroll to top"
      title="Lên đầu trang"
    >
      <Icon icon={ChevronsUp} size={18} />
    </button>
  );
};

export default ScrollToTopButton;