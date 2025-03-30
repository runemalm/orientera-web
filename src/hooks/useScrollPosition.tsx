
import { useEffect, useState } from "react";

// Custom hook to save and restore scroll position
export const useScrollPosition = () => {
  const [savedPosition, setSavedPosition] = useState<number | null>(null);

  // Save current scroll position
  const saveScrollPosition = () => {
    setSavedPosition(window.scrollY);
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  // Restore saved scroll position
  const restoreScrollPosition = () => {
    const savedPos = sessionStorage.getItem('scrollPosition');
    if (savedPos) {
      window.scrollTo(0, parseInt(savedPos));
      // Clear saved position after restoring
      sessionStorage.removeItem('scrollPosition');
    }
  };

  return { 
    saveScrollPosition,
    restoreScrollPosition,
    savedPosition
  };
};
