import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFaro } from './hooks/useFaro'

function App() {
  const [count, setCount] = useState(0)
  const { logEvent, logError, logUserAction, logMeasurement } = useFaro()

  // Log when component mounts
  useEffect(() => {
    logEvent('app_mounted', {
      component: 'App',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    })

    // Log page load performance
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart
      logMeasurement('page_load_time', pageLoadTime, {
        metric: 'initial_page_load',
      })
    }
  }, [logEvent, logMeasurement])

  const handleCountClick = () => {
    const startTime = performance.now()
    
    // Update count
    setCount((count) => count + 1)
    
    // Log user action
    logUserAction('button_click', 'count_button', {
      currentCount: count,
      newCount: count + 1,
    })

    // Measure button click performance
    const endTime = performance.now()
    logMeasurement('button_click_duration', endTime - startTime, {
      action: 'count_increment',
    })
  }

  const handleLogoClick = (logoType) => {
    logUserAction('logo_click', `${logoType}_logo`, {
      logoType,
      destination: logoType === 'vite' ? 'https://vite.dev' : 'https://react.dev',
    })
  }

  const simulateError = () => {
    try {
      // Intentionally cause an error for testing
      throw new Error('This is a test error for Grafana Faro!')
    } catch (error) {
      logError(error, {
        component: 'App',
        action: 'simulate_error',
        userTriggered: true,
        count: count,
      })
    }
  }

  const simulateSlowOperation = async () => {
    const startTime = performance.now()
    
    logEvent('slow_operation_started', {
      operation: 'simulate_async_task'
    })

    // Simulate a slow async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const endTime = performance.now()
    const duration = endTime - startTime

    logMeasurement('async_operation_duration', duration, {
      operation: 'simulate_async_task',
      success: true,
    })

    logEvent('slow_operation_completed', {
      operation: 'simulate_async_task',
      duration: duration,
    })
  }

  return (
    <>
      <div>
        <a 
          href="https://vite.dev" 
          target="_blank"
          onClick={() => handleLogoClick('vite')}
        >
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a 
          href="https://react.dev" 
          target="_blank"
          onClick={() => handleLogoClick('react')}
        >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Grafana Faro</h1>
      <div className="card">
        <button onClick={handleCountClick}>
          count is {count}
        </button>
        <br />
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={simulateError}
            style={{ 
              marginRight: '10px', 
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Error Logging
          </button>
          <button 
            onClick={simulateSlowOperation}
            style={{ 
              backgroundColor: '#4ecdc4',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Slow Operation
          </button>
        </div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        <br />
        <small style={{ color: '#888' }}>
          All interactions are being tracked by Grafana Faro!
          <br />
          Check your browser console and network tab to see the telemetry data.
        </small>
      </p>
    </>
  )
}

export default App
