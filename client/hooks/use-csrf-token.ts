import { useState, useEffect } from 'react';

interface CsrfState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage CSRF token
 * Automatically fetches token on mount and provides methods to refresh it
 */
export function useCsrfToken() {
  const [state, setState] = useState<CsrfState>({
    token: null,
    isLoading: true,
    error: null,
  });

  const fetchToken = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include', // Important: include cookies
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        setState({
          token: data.token,
          isLoading: false,
          error: null,
        });
        
        // Store token in sessionStorage as backup
        sessionStorage.setItem('csrf_token', data.token);
      } else {
        throw new Error('Invalid CSRF token response');
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      setState({
        token: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    // Try to get token from sessionStorage first
    const storedToken = sessionStorage.getItem('csrf_token');
    if (storedToken) {
      setState({
        token: storedToken,
        isLoading: false,
        error: null,
      });
    }
    
    // Fetch fresh token
    fetchToken();
  }, []);

  return {
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    refresh: fetchToken,
  };
}

/**
 * Helper function to create fetch options with CSRF token
 */
export function withCsrfToken(
  token: string | null,
  options: RequestInit = {}
): RequestInit {
  if (!token) {
    console.warn('CSRF token not available');
    return options;
  }

  return {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      ...options.headers,
      'X-CSRF-Token': token,
    },
  };
}
