import React from 'react'
import useHealthCheck from '../hooks/useHealthCheck';
import LoadingScreen from './LoadingScreen';
import App from '../App';

const HealthCheckWrapper = () => {
  const isBackendReady = useHealthCheck();

  if (!isBackendReady) {
    return <LoadingScreen />;
  }

  return <App />;
};

export default HealthCheckWrapper