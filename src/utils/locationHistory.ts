
// Utility functions for managing location history in localStorage

// Maximum number of locations to store in history
export const MAX_HISTORY_ITEMS = 5;

// Location type definition
export interface LocationItem {
  name: string;
  display: string;
}

// Get location history from localStorage
export const getLocationHistory = (): LocationItem[] => {
  try {
    const history = localStorage.getItem('locationHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading location history:", error);
    return [];
  }
};

// Save location history to localStorage
export const saveLocationHistory = (location: LocationItem) => {
  try {
    // Get current history
    let history = getLocationHistory();
    
    // Remove if this location already exists (to move it to the top)
    history = history.filter(item => item.name !== location.name);
    
    // Add new location at the beginning
    history.unshift(location);
    
    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    // Save updated history
    localStorage.setItem('locationHistory', JSON.stringify(history));
  } catch (error) {
    console.error("Error saving location history:", error);
  }
};

// Remove a location from history
export const removeFromHistory = (locationName: string) => {
  try {
    // Get current history
    let history = getLocationHistory();
    
    // Filter out the location to remove
    history = history.filter(item => item.name !== locationName);
    
    // Save updated history
    localStorage.setItem('locationHistory', JSON.stringify(history));
    
    return history;
  } catch (error) {
    console.error("Error removing location from history:", error);
    return getLocationHistory();
  }
};

// Clear all location history
export const clearLocationHistory = () => {
  try {
    localStorage.removeItem('locationHistory');
    return [];
  } catch (error) {
    console.error("Error clearing location history:", error);
    return getLocationHistory();
  }
};
