import { useState, useEffect } from "react";


export const useIsMobileView = (threshold: number = 800) => {
  const [isMobile, setIsMobile] = useState(window.outerWidth < threshold);
  console.log("");


  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${threshold}px`);
    setIsMobile(mq.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mq.addEventListener('change', handleResize);
    return () => mq.removeEventListener('change', handleResize);
  }, [threshold]);

  return isMobile;
};
