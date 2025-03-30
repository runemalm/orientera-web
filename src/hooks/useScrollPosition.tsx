
import { useState, useEffect } from 'react';

type ScrollPositions = {
  [key: string]: number;
};

// This hook saves and restores scroll positions for different routes
export const useScrollPosition = () => {
  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>({});

  // Save current scroll position for a specific key (usually route path)
  const saveScrollPosition = (key: string) => {
    const position = window.scrollY;
    setScrollPositions(prev => ({ ...prev, [key]: position }));
  };

  // Get saved scroll position for a key
  const getSavedScrollPosition = (key: string): number => {
    return scrollPositions[key] || 0;
  };

  // Restore scroll position for a key
  const restoreScrollPosition = (key: string) => {
    const savedPosition = scrollPositions[key] || 0;
    setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 0);
  };

  return {
    saveScrollPosition,
    getSavedScrollPosition,
    restoreScrollPosition,
    scrollPositions
  };
};
