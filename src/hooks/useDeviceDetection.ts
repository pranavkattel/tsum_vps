import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Check for mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || width < 768;
      
      // Check for tablet
      const isTabletDevice = width >= 768 && width < 1024;
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
    };

    // Check on mount
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};