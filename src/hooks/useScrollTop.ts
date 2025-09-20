import { useState, useEffect } from 'react';

export default function useScrollTop(threshold = 240) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = (behavior: 'auto' | 'smooth' = 'smooth') => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior });
  };

  return { visible, scrollToTop };
}