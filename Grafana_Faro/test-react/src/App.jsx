import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFaro } from './hooks/useFaro'

function App() {
  const [count, setCount] = useState(0)
  const { logEvent, logError, logUserAction, logMeasurement } = useFaro()

  useEffect(() => {
    // Event for mounting
    logEvent('app_mounted', {
      component: 'App',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    })

    // Page Load Metric using performance.now()
    const pageLoadTime = performance.now()
    logMeasurement('page_load_time', pageLoadTime, {
      metric: 'initial_page_load',
    })
  }, [])

  const handleCountClick = () => {
    const start = performance.now()
    const newCount = count + 1
    setCount(newCount)

    logUserAction('button_click', 'count_button', {
      currentCount: count,
      newCount,
    })

    const end = performance.now()
    logMeasurement('button_click_duration', end - start, {
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
      throw new Error('This is a test error for Grafana Faro!')
    } catch (err) {
      logError(err, {
        component: 'App',
        action: 'simulate_error',
        userTriggered: true,
        count,
      })
    }
  }

  const simulateSlowOperation = async () => {
    const start = performance.now()
    logEvent('slow_operation_started', { operation: 'simulate_async_task' })

    await new Promise((res) => setTimeout(res, 2000))

    const duration = performance.now() - start
    logMeasurement('async_operation_duration', duration, {
      operation: 'simulate_async_task',
      success: true,
    })

    logEvent('slow_operation_completed', {
      operation: 'simulate_async_task',
      duration,
    })
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" onClick={() => handleLogoClick('vite')}>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" onClick={() => handleLogoClick('react')}>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Grafana Faro</h1>
      <div className="card">
        <button onClick={handleCountClick}>count is {count}</button>
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
              cursor: 'pointer',
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
              cursor: 'pointer',
            }}
          >
            Test Slow Operation
          </button>
        </div>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
      <p className="read-the-docs">
        All interactions are being tracked by Grafana Faro!
        <br />
        Check the browser console and Grafana dashboard.
      </p>
    </>
  )
}

export default App
