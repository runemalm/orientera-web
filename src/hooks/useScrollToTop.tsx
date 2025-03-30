
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This hook scrolls the window to the top when the route changes
// and handles scrolling to hash fragments, but respects saved scroll positions
export const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      // Small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else if (pathname !== '/search') {
      // Scroll to top for all pages except search
      // Search page will handle its own scroll position with useScrollPosition
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};
