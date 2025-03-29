
import * as React from "react"

// Define breakpoint constants
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check on component mount
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    
    // Create handler function
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Return false as fallback when server rendering or not determined yet
  return isMobile ?? false
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<"mobile" | "tablet" | "desktop" | undefined>(
    undefined
  )

  React.useEffect(() => {
    // Function to determine current breakpoint
    const determineBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < BREAKPOINTS.MOBILE) {
        setBreakpoint("mobile")
      } else if (width < BREAKPOINTS.TABLET) {
        setBreakpoint("tablet")
      } else {
        setBreakpoint("desktop")
      }
    }

    // Initial check
    determineBreakpoint()
    
    // Add event listener
    window.addEventListener("resize", determineBreakpoint)
    
    // Clean up
    return () => window.removeEventListener("resize", determineBreakpoint)
  }, [])

  return breakpoint ?? "desktop"
}
