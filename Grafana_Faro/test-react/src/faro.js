import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

// Initialize Faro with debug logging
export const faro = initializeFaro({
  url: 'http://localhost:12347/collect', // Grafana Alloy endpoint
  app: {
    name: 'test-react',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // Automatic instrumentations
  instrumentations: [
    ...getWebInstrumentations({
      captureConsole: true,
      captureUnhandledErrors: true,
      captureWebVitals: true,
      captureDomEvents: true,
    }),
    new TracingInstrumentation(),
  ],

  sessionTracking: {
    enabled: true,
    trackPageViews: true,
  },

  user: {
    id: 'test-user-' + Math.random().toString(36).substr(2, 9),
  },

  metadata: {
    browser: navigator.userAgent,
    url: window.location.origin,
    framework: 'React + Vite',
  },

  // Enable debug mode
  beforeSend: (event) => {
    console.log('Faro sending event:', event);
    return event;
  },

  // Add batching configuration
  batching: {
    enabled: true,
    sendTimeout: 1000, // Send every 1 second
  },
});

console.log('Grafana Faro initialized successfully');

// Push test event (logs to Loki)
setTimeout(() => {
  console.log('Testing Faro connection...');
  faro.api.pushEvent('faro_test', {
    message: 'Testing Faro connection',
    timestamp: new Date().toISOString(),
  });
}, 2000);

// Push test trace (goes to Tempo)
setTimeout(() => {
  console.log('Sending test trace to Tempo...');
  faro.api.pushTraces([
    {
      name: 'manual_test_trace',
      timestamp: Date.now(),
      duration: 500, // 500ms
      attributes: {
        action: 'test_span',
        message: 'Hello Tempo!',
      },
    },
  ]);
}, 3000);
