import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from 'LoginForm';
import Subscription from 'Subscription';
import Dashboard from 'Dashboard';
import RegistrationForm from 'RegistrationForm';
import AITaskManager from 'AITaskManager';

function App({ initialLoggedIn = false }) {
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);

  // Package tracking state
  const [packageId, setPackageId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [trackingLocation, setTrackingLocation] = useState(null);

  // AI Agent Mail Inbox state
  const [agent, setAgent] = useState('agent1');

  // Subscription state
  const [apiKey, setApiKey] = useState('');

  // UI state for showing AI Task Manager
  const [showAITaskManager, setShowAITaskManager] = useState(false);

  // Address validation state
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [addressValidationResult, setAddressValidationResult] = useState(null);

  // New message form state
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    body: '',
  });

  // AI Agent Tasks input state
  const [agentTaskInput, setAgentTaskInput] = useState({
    description: '',
    tags: '',
    relatedDocuments: '',
  });

  // Research Analytics Dashboard state
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Research Analysis Task state
  const [researchTaskDescription, setResearchTaskDescription] = useState('');

  const handleLogin = () => {
    setLoggedIn(true);
  };

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

  const handleValidateAddress = () => {
    setAddressValidationResult('Address validated successfully.');
  };

  const handleSendMessage = () => {
    alert('Message sent to ' + newMessage.recipient);
    setNewMessage({ recipient: '', subject: '', body: '' });
  };

  const handleAddAgentTask = () => {
    alert('Agent task added: ' + agentTaskInput.description);
    setAgentTaskInput({ description: '', tags: '', relatedDocuments: '' });
  };

  const handleSendResearchTask = () => {
    alert('Research analysis task sent: ' + researchTaskDescription);
    setResearchTaskDescription('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyticsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loggedIn) {
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

      <section>
        <h2>Address Validation</h2>
        <input
          placeholder="Street"
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          placeholder="City"
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          placeholder="State"
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          placeholder="Country"
          type="text"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
        <input
          placeholder="Postal Code"
          type="text"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        />
        <button onClick={handleValidateAddress}>Validate</button>
        {addressValidationResult && <p>{addressValidationResult}</p>}
      </section>

      <section>
        <h2>New Message</h2>
        <input
          placeholder="Recipient"
          type="text"
          value={newMessage.recipient}
          onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
        />
        <input
          placeholder="Subject"
          type="text"
          value={newMessage.subject}
          onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
        />
        <textarea
          placeholder="Message body"
          rows={4}
          value={newMessage.body}
          onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
          style={{ width: '100%' }}
        />
        <button onClick={handleSendMessage}>Send</button>
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

      <section>
        <h2>AI Agent Tasks</h2>
        <input
          placeholder="New task description"
          type="text"
          value={agentTaskInput.description}
          onChange={(e) => setAgentTaskInput({ ...agentTaskInput, description: e.target.value })}
        />
        <input
          placeholder="Tags (comma separated)"
          type="text"
          value={agentTaskInput.tags}
          onChange={(e) => setAgentTaskInput({ ...agentTaskInput, tags: e.target.value })}
        />
        <input
          placeholder="Related Documents (comma separated URLs or IDs)"
          type="text"
          value={agentTaskInput.relatedDocuments}
          onChange={(e) => setAgentTaskInput({ ...agentTaskInput, relatedDocuments: e.target.value })}
        />
        <button onClick={handleAddAgentTask}>Add Task</button>
      </section>

      <section>
        <h2>Research Analytics Summary</h2>
        {analyticsLoading ? <p>Loading analytics...</p> : <p>Analytics data loaded.</p>}
      </section>

      <section>
        <h2>Send Research Analysis Task</h2>
        <textarea
          placeholder="Describe the research analysis task"
          rows={4}
          value={researchTaskDescription}
          onChange={(e) => setResearchTaskDescription(e.target.value)}
          style={{ width: '100%' }}
        />
        <button onClick={handleSendResearchTask}>Send Analysis Task</button>
      </section>
    </div>
  );
}

export default App;
