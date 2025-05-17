import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import Subscription from './Subscription';
import Dashboard from './Dashboard';
import RegistrationForm from './RegistrationForm';
import AITaskManager from './AITaskManager';

function App({ initialLoggedIn = false }) {
  const [loggedIn, setLoggedIn] = React.useState(initialLoggedIn);

  // Package tracking state
  const [packageId, setPackageId] = React.useState('');
  const [trackingStatus, setTrackingStatus] = React.useState(null);
  const [trackingLocation, setTrackingLocation] = React.useState(null);

  // AI Agent Mail Inbox state
  const [agent, setAgent] = React.useState('agent1');

  // Subscription state
  const [apiKey, setApiKey] = React.useState('');

  // UI state for showing AI Task Manager
  const [showAITaskManager, setShowAITaskManager] = React.useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <Router>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegistrationForm onRegisterSuccess={() => window.location.href = '/login'} />} />
          <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  const handleTrackPackage = async () => {
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tracking info');
      }
      const data = await response.json();
      setTrackingStatus(data.status);
      setTrackingLocation(data.location);
    } catch (error) {
      setTrackingStatus('Error fetching tracking info');
      setTrackingLocation(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Global AI Postal System</h1>

      <Subscription apiKey={apiKey} onSubscriptionChange={setApiKey} />

      <section>
        <h2>Track Package</h2>
        <input
          placeholder="Enter Package ID"
          type="text"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        />
        <button onClick={handleTrackPackage}>Track</button>
        {trackingStatus && (
          <div>
            <p>Status: {trackingStatus}</p>
            {trackingLocation && <p>Location: {trackingLocation}</p>}
          </div>
        )}
      </section>

      <button onClick={() => setShowAITaskManager(!showAITaskManager)} style={{ marginTop: 20 }}>
        {showAITaskManager ? 'Hide' : 'Show'} AI Task Manager
      </button>

      {showAITaskManager ? (
        <AITaskManager apiKey={apiKey} agent={agent} />
      ) : (
        <Dashboard apiKey={apiKey} agent={agent} />
      )}

      <section style={{ marginTop: 40 }}>
        <h2>AI Agent Mail Inbox</h2>
        <div>
          <label htmlFor="agent-input">Agent:</label>
          <input
            id="agent-input"
            type="text"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
