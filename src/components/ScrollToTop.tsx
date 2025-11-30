import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top with animation when pathname changes
    if (typeof window !== 'undefined') {
      // Use smooth behavior for better UX
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
      
      // Also force scroll for browsers that don't support smooth
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [pathname]);

  return null;
}
