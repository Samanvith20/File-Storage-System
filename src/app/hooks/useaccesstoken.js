"use client";
import { useState, useEffect } from 'react';

const useAccessToken = () => {
    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [accessToken, setAccessToken] = useState(accesstoken || null);
  const [loading, setLoading] = useState(true);

 
  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/auth/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        return true; // Valid
      }

      return false; // Invalid
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  
  const refreshAccessToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        setAccessToken(data.accessToken);
        return data.accessToken;
      } else {
        console.warn('Token refresh failed:', data.message);
        setAccessToken(null);
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setAccessToken(null);
      return null;
    }
  };

  
  useEffect(() => {
    const initialize = async () => {
      let token = accessToken || accessToken;
      const isValid = await validateToken(token);


      if (!isValid) {
        token = await refreshAccessToken(); 
      }

      setAccessToken(token); 
      setLoading(false);
    };

    initialize();
  }, []);

  return { accessToken, loading };
};

export default useAccessToken;
