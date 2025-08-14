import React from 'react';
import { Platform } from 'react-native';

/**
 * Check if running in development mode
 */
export const isDevelopment = __DEV__;

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Higher-order component for memoization
 * @param {React.Component} Component - Component to memoize
 * @param {Function} areEqual - Custom comparison function
 * @returns {React.Component} - Memoized component
 */
export const withMemo = (Component, areEqual = null) => {
  return React.memo(Component, areEqual);
};

/**
 * Create a memoized component with custom comparison
 * @param {Function} renderFunction - Render function
 * @param {Function} areEqual - Custom comparison function
 * @returns {React.Component} - Memoized component
 */
export const createMemoizedComponent = (renderFunction, areEqual = null) => {
  const Component = React.memo(renderFunction, areEqual);
  Component.displayName = renderFunction.name || 'MemoizedComponent';
  return Component;
};

/**
 * Lazy load component with error boundary
 * @param {Function} importFunction - Dynamic import function
 * @returns {React.Component} - Lazy loaded component
 */
export const lazyLoadComponent = (importFunction) => {
  return React.lazy(importFunction);
};

/**
 * Create a loading component
 * @param {Object} props - Component props
 * @returns {React.Component} - Loading component
 */
export const LoadingComponent = ({ style, color = '#007AFF', size = 'large' }) => {
  const { ActivityIndicator } = require('react-native');
  return <ActivityIndicator style={style} color={color} size={size} />;
};

/**
 * Create an error component
 * @param {Object} props - Component props
 * @returns {React.Component} - Error component
 */
export const ErrorComponent = ({ message, onRetry, style }) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useTranslation } = require('react-i18next');
  
  const { t } = useTranslation();
  
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
        {message || t('common.error')}
      </Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>
            {t('common.retry')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Create an empty state component
 * @param {Object} props - Component props
 * @returns {React.Component} - Empty state component
 */
export const EmptyStateComponent = ({ message, icon, style }) => {
  const { View, Text } = require('react-native');
  const { useTranslation } = require('react-i18next');
  
  const { t } = useTranslation();
  
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
      {icon && icon}
      <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 16 }}>
        {message || t('common.noData')}
      </Text>
    </View>
  );
};

/**
 * Debounced search hook
 * @param {Function} searchFunction - Search function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced search function
 */
export const useDebouncedSearch = (searchFunction, delay = 300) => {
  const { useState, useEffect, useCallback } = React;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchFunction(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchFunction]);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return handleSearch;
};

/**
 * Hook for handling loading states
 * @returns {Object} - Loading state handlers
 */
export const useLoadingState = () => {
  const { useState, useCallback } = React;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);
  
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);
  
  const setLoadingError = useCallback((error) => {
    setError(error);
    setLoading(false);
  }, []);
  
  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);
  
  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    resetState
  };
};
