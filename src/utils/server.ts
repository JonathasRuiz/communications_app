import { env } from './env';

// Conditional host variable based on NODE_ENV
const getHost = (): string => {
  const nodeEnv = env.NODE_ENV;
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_SERVER_PORT;

  console.log(`[Runtime Config] NODE_ENV: ${nodeEnv}, Server Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getWsClientHost = (): string => {
  const hostEnv = env.REACT_APP_WS_CLIENT_HOST;
  const portEnv = env.REACT_APP_WS_CLIENT_PORT;

  console.log(`[Runtime Config] WS Client Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getWsServerHost = (): string => {
  const hostEnv = env.REACT_APP_WS_SERVER_HOST;
  const portEnv = env.REACT_APP_WS_SERVER_PORT;

  console.log(`[Runtime Config] WS Server Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getTrackerHost = (): string => {
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_TRACKER_PORT;

  console.log(`[Runtime Config] Tracker Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getTrackerClientHost = (): string => {
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_TRACKER_CLIENT;

  console.log(`[Runtime Config] Tracker Client Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getTrackerServerGoHost = (): string => {
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_TRACKER_SERVER_GO_PORT;

  console.log(`[Runtime Config] Tracker Server Go Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getTrackerClientGoHost = (): string => {
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_TRACKER_CLIENT_GO_PORT;

  console.log(`[Runtime Config] Tracker Client Go Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

const getTrackerAnalyticsHost = (): string => {
  const hostEnv = env.REACT_APP_SERVER_URL;
  const portEnv = env.REACT_APP_TRACKER_ANALYTICS_PORT;

  console.log(`[Runtime Config] Tracker Analytics Host: ${hostEnv}:${portEnv}`);

  return `http://${hostEnv}:${portEnv}`;
};

export const HOST = getHost();
export const WS_SERVER_HOST = getWsServerHost();
export const WS_CLIENT_HOST = getWsClientHost();
export const TRACKER_HOST = getTrackerHost();
export const TRACKER_CLIENT_HOST = getTrackerClientHost();
export const TRACKER_SERVER_GO_HOST = getTrackerServerGoHost();
export const TRACKER_CLIENT_GO_HOST = getTrackerClientGoHost();
export const TRACKER_ANALYTICS_HOST = getTrackerAnalyticsHost()
export const MQTT_WS_URL = env.REACT_APP_MQTT_WS_URL;

// Optional: Export the function if you need to call it dynamically
export { getHost, 
  getTrackerHost, 
  getTrackerClientHost, 
  getTrackerServerGoHost, 
  getTrackerClientGoHost, 
  getTrackerAnalyticsHost,
  getWsServerHost,
  getWsClientHost };

// Optional: You can also export specific environment checks
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
