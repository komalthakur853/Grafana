import { faro } from '../faro';

export const useFaro = () => {
  // Log custom events
  const logEvent = (name, data = {}) => {
    try {
      faro.api.pushEvent(name, {
        timestamp: new Date().toISOString(),
        ...data,
      });
      console.log(`Faro Event: ${name}`, data);
    } catch (error) {
      console.error('Failed to log Faro event:', error);
    }
  };

  // Log custom errors
  const logError = (error, context = {}) => {
    try {
      faro.api.pushError(error, {
        timestamp: new Date().toISOString(),
        ...context,
      });
      console.log('Faro Error logged:', error.message);
    } catch (err) {
      console.error('Failed to log Faro error:', err);
    }
  };

  // Create custom measurements (for performance tracking)
  const logMeasurement = (name, value, labels = {}) => {
    try {
      faro.api.pushMeasurement({
        type: 'custom',
        name,
        value,
        labels: {
          timestamp: new Date().toISOString(),
          ...labels,
        },
      });
      console.log(`Faro Measurement: ${name} = ${value}`, labels);
    } catch (error) {
      console.error('Failed to log Faro measurement:', error);
    }
  };

  // Log user actions (clicks, navigation, etc.)
  const logUserAction = (action, target, data = {}) => {
    logEvent('user_action', {
      action,
      target,
      page: window.location.pathname,
      ...data,
    });
  };

  // Set user information dynamically
  const setUser = (userInfo) => {
    try {
      faro.api.setUser(userInfo);
      console.log('Faro user set:', userInfo);
    } catch (error) {
      console.error('Failed to set Faro user:', error);
    }
  };

  return {
    logEvent,
    logError,
    logMeasurement,
    logUserAction,
    setUser,
  };
};
