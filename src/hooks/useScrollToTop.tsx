import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This hook scrolls the window to the top when the route changes
// and handles scrolling to hash fragments or restoring previous scroll position
export const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // If this is the search page, check if we need to restore scroll position
      if (pathname === '/search') {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
          sessionStorage.removeItem('scrollPosition');
          return;
        }
      }
      
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
        // Otherwise, scroll to the top of the page (except for search page)
        window.scrollTo(0, 0);
      }
    };

    // Use a small timeout to ensure the page has fully rendered
    setTimeout(handleScroll, 100);
  }, [pathname, hash]);

  return null;
};
