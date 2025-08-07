const faroConfig = {
  development: {
    url: 'http://localhost:12347/collect',
    environment: 'development',
    app: {
      name: 'test-react-app',
      version: '1.0.0',
    },
    sessionTracking: {
      enabled: true,
      trackPageViews: true,
    },
    // More verbose logging in development
    debug: true,
  },
  production: {
    url: 'https://your-production-alloy-endpoint.com/collect',
    environment: 'production',
    app: {
      name: 'test-react-app',
      version: process.env.npm_package_version || '1.0.0',
    },
    sessionTracking: {
      enabled: true,
      trackPageViews: true,
    },
    debug: false,
  },
};

export const getFaroConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return faroConfig[env] || faroConfig.development;
};
