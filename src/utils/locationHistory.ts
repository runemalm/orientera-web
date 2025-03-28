
// Maximum number of locations to store in history
const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'locationHistory';

export interface LocationHistoryItem {
  name: string;
  display?: string;
  timestamp: number;
}

/**
 * Get the saved location history from localStorage
 */
export function getLocationHistory(): LocationHistoryItem[] {
  try {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    if (!Array.isArray(history)) return [];
    
    return history;
  } catch (error) {
    console.error('Failed to get location history from localStorage:', error);
    return [];
  }
}

/**
 * Add a location to history, avoiding duplicates and maintaining order
 */
export function addToLocationHistory(name: string, display?: string): void {
  try {
    const history = getLocationHistory();
    
    // Remove existing entry with the same name if it exists
    const filteredHistory = history.filter(item => item.name !== name);
    
    // Add new item at the beginning
    const newHistory = [
      { name, display, timestamp: Date.now() },
      ...filteredHistory
    ].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save location history to localStorage:', error);
  }
}
