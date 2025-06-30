"use client";
import { useState, useEffect, useRef } from "react";

/**
 * A simplified hook for using localStorage with React
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value to use if no value is found in localStorage
 * @returns A tuple of [storedValue, setValue] similar to useState
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  // Ref to track initialization status
  const isInitialized = useRef(false);

  // Create state for the stored value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Create state to track if we're on the client side
  const [isClient, setIsClient] = useState(false);

  // On first render, mark that we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize from localStorage on client-side only once
  useEffect(() => {
    // Skip if not on client or already initialized
    if (!isClient || isInitialized.current) return;

    try {
      // Try to get value from localStorage
      const item = localStorage.getItem(key);

      // If we have a value, parse and use it
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      // On error, fall back to initial value
      console.error(`Error reading from localStorage key "${key}":`, error);
    }

    // Mark as initialized
    isInitialized.current = true;
  }, [isClient, key]);

  // Function to update the value in state and localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Handle function updates
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update React state
      setStoredValue(valueToStore);

      // Update localStorage if on client
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
