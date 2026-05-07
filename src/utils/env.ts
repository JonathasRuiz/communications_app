// Runtime environment configuration reader
// Falls back to build-time process.env for development

declare global {
  interface Window {
    _env_: {
      REACT_APP_SERVER_URL?: string;
      REACT_APP_SERVER_PORT?: string;
      REACT_APP_WS_CLIENT_HOST?: string;
      REACT_APP_WS_CLIENT_PORT?: string;
      REACT_APP_WS_SERVER_HOST?: string;
      REACT_APP_WS_SERVER_PORT?: string;
      REACT_APP_TRACKER_PORT?: string;
      REACT_APP_TRACKER_CLIENT?: string;
      REACT_APP_TRACKER_SERVER_GO_PORT?: string;
      REACT_APP_TRACKER_CLIENT_GO_PORT?: string;
      REACT_APP_TRACKER_ANALYTICS_PORT?: string;
      REACT_APP_MQTT_WS_URL?: string;
      REACT_APP_GOOGLE_MAPS_API_KEY?: string;
      NODE_ENV?: string;
    };
  }
}

// Get runtime env var (works in both dev and production)
const getEnv = (key: string, defaultValue: string = ''): string => {
  // Try runtime config first (window._env_)
  if (typeof window !== 'undefined' && window._env_ && window._env_[key as keyof typeof window._env_]) {
    const value = window._env_[key as keyof typeof window._env_];
    // Handle template literals that weren't replaced
    if (value && !value.includes('${') && value !== 'undefined') {
      return value;
    }
  }
  
  // Fall back to build-time process.env (for development)
  const processEnv = process.env[key];
  if (processEnv) {
    return processEnv;
  }
  
  return defaultValue;
};

// Runtime environment object - mirrors your current .env structure
export const env = {
  // Server Configuration
  REACT_APP_SERVER_URL: getEnv('REACT_APP_SERVER_URL', 'localhost'),
  REACT_APP_SERVER_PORT: getEnv('REACT_APP_SERVER_PORT', '8080'),
  
  // WebSocket Configuration
  REACT_APP_WS_CLIENT_HOST: getEnv('REACT_APP_WS_CLIENT_HOST', 'localhost'),
  REACT_APP_WS_CLIENT_PORT: getEnv('REACT_APP_WS_CLIENT_PORT', '8080'),
  REACT_APP_WS_SERVER_HOST: getEnv('REACT_APP_WS_SERVER_HOST', 'localhost'),
  REACT_APP_WS_SERVER_PORT: getEnv('REACT_APP_WS_SERVER_PORT', '8080'),
  
  // Tracker Service Ports
  REACT_APP_TRACKER_PORT: getEnv('REACT_APP_TRACKER_PORT', '8080'),
  REACT_APP_TRACKER_CLIENT: getEnv('REACT_APP_TRACKER_CLIENT', '3001'),
  REACT_APP_TRACKER_SERVER_GO_PORT: getEnv('REACT_APP_TRACKER_SERVER_GO_PORT', '8080'),
  REACT_APP_TRACKER_CLIENT_GO_PORT: getEnv('REACT_APP_TRACKER_CLIENT_GO_PORT', '8081'),
  REACT_APP_TRACKER_ANALYTICS_PORT: getEnv('REACT_APP_TRACKER_ANALYTICS_PORT', '5050'),
  
  // MQTT Configuration
  REACT_APP_MQTT_WS_URL: getEnv('REACT_APP_MQTT_WS_URL', 'ws://localhost:9001/mqtt'),
  
  // Google Maps API Key
  REACT_APP_GOOGLE_MAPS_API_KEY: getEnv('REACT_APP_GOOGLE_MAPS_API_KEY', ''),
  
  // Environment
  NODE_ENV: getEnv('NODE_ENV', 'development'),
};

export default env;
