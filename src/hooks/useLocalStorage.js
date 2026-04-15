// CampusVibe — React hook for syncing state with localStorage

import { useState, useEffect } from 'react';

/**
 * A React hook that persists state in localStorage.
 * Handles JSON serialization/deserialization and works gracefully
 * in SSR environments where `window` may not exist.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The default value if nothing is stored
 * @returns {[*, Function]} A stateful value and a setter function
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
