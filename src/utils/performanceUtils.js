import { useCallback, useMemo } from 'react';

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Hook for memoized callback with dependencies
 * @param {Function} callback - The callback function
 * @param {Array} dependencies - Dependencies array
 * @returns {Function} - Memoized callback
 */
export const useMemoizedCallback = (callback, dependencies = []) => {
  return useCallback(callback, dependencies);
};

/**
 * Hook for memoized value with dependencies
 * @param {Function} factory - The factory function
 * @param {Array} dependencies - Dependencies array
 * @returns {any} - Memoized value
 */
export const useMemoizedValue = (factory, dependencies = []) => {
  return useMemo(factory, dependencies);
};

/**
 * Deep comparison of two objects
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} - True if objects are equal
 */
export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

/**
 * Shallow comparison of two objects
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} - True if objects are equal
 */
export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

/**
 * Hook for deep comparison of values
 * @param {any} value - Value to compare
 * @param {Function} compareFn - Comparison function
 * @returns {boolean} - True if value has changed
 */
export const useDeepCompare = (value, compareFn = deepEqual) => {
  const prevValue = useMemo(() => value, []);
  return !compareFn(prevValue, value);
};

/**
 * Hook for shallow comparison of values
 * @param {any} value - Value to compare
 * @returns {boolean} - True if value has changed
 */
export const useShallowCompare = (value) => {
  return useDeepCompare(value, shallowEqual);
};
