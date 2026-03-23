import { useEffect, useState } from 'react';
import axiosBaseUrl from '../api/AxiosConfig';

const useHealthCheck = () => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await axiosBaseUrl.get('/api/auth/health', { timeout: 5000 });
        setIsBackendReady(true);
      } catch (error) {
        // Retry with exponential backoff (max 30 seconds between retries)
        const delay = Math.min(1000 * Math.pow(1.5, retryCount), 30000);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, delay);
        console.error('Backend health check failed, retrying... :', error);
      }
    };

    if (!isBackendReady) {
      checkBackendHealth();
    }
  }, [retryCount, isBackendReady]);

  return isBackendReady;
};

export default useHealthCheck;
