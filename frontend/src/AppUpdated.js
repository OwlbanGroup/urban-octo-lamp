import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Subscription from './Subscription';

function AppUpdated({ initialLoggedIn = false }) {
  const [loggedIn, setLoggedIn] = React.useState(initialLoggedIn);

  // Package tracking state
  const [packageId, setPackageId] = React.useState('');
  const [trackingStatus, setTrackingStatus] = React.useState(null);
  const [trackingLocation, setTrackingLocation] = React.useState(null);

  // Revenue optimizer state
  const [revenueOpportunities, setRevenueOpportunities] = React.useState([]);

  // AI Agent Mail Inbox state
  const [agent, setAgent] = React.useState('agent1');
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState({
    recipient: '',
    subject: '',
    body: '',
  });
  const [messageError, setMessageError] = React.useState(null);

  // AI Agent Tasks state
  const [tasks, setTasks] = React.useState([]);
  const [newTaskDescription, setNewTaskDescription] = React.useState('');
  const [newTaskPriority, setNewTaskPriority] = React.useState('1');
  const [newTaskTags, setNewTaskTags] = React.useState('');
  const [newTaskRelatedDocs, setNewTaskRelatedDocs] = React.useState('');

  // Research Analytics Dashboard state
  const [researchSummary, setResearchSummary] = React.useState('Loading analytics...');

  // Research Analysis Task state
  const [researchTaskDescription, setResearchTaskDescription] = React.useState('');

  // Subscription state
  const [apiKey, setApiKey] = React.useState('');

  // Address validation state
  const [address, setAddress] = React.useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [addressValidationResult, setAddressValidationResult] = React.useState(null);
  const [addressValidationError, setAddressValidationError] = React.useState(null);

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

  const fetchRevenueOpportunities = async () => {
    try {
      const response = await fetch('/ai/revenue_opportunities', {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch revenue opportunities');
      }
      const data = await response.json();
      setRevenueOpportunities(data.opportunities);
    } catch (error) {
      setRevenueOpportunities([]);
    }
  };

  // Fetch AI agent tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('/ai/get_responses/' + agent, {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && Array.isArray(data.opportunities)) {
        setTasks(data.opportunities);
      } else {
        console.warn('Fetched tasks data is not an array:', data);
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
    }
  };

  // Add new AI task
  const addTask = async () => {
    if (!newTaskDescription) return;
    const task = {
      id: Date.now().toString(),
      description: newTaskDescription,
      status: 'pending',
      result: null,
    };
    try {
      const response = await fetch('/ai/send_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey || 'default-secure-api-key',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      await response.json();
      setNewTaskDescription('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // Send research analysis task
  const sendResearchAnalysis = async () => {
    if (!researchTaskDescription) return;
    try {
      const response = await fetch('/ai/send_research_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey || 'default-secure-api-key',
        },
        body: JSON.stringify({ description: researchTaskDescription }),
      });
      if (!response.ok) {
        throw new Error('Failed to send research analysis task');
      }
      const data = await response.json();
      setResearchSummary(data.summary);
      setResearchTaskDescription('');
    } catch (error) {
      setResearchSummary('Error sending research analysis task');
    }
  };

  // Fetch messages for AI Agent Mail Inbox
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/messages/${agent}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      setMessageError(null);
    } catch (error) {
      setMessages([]);
      setMessageError(error.message);
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.body) {
      setMessageError('Please fill in all message fields');
      return;
    }
    try {
      const response = await fetch('/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      await response.json();
      setNewMessage({ recipient: '', subject: '', body: '' });
      fetchMessages();
      setMessageError(null);
    } catch (error) {
      setMessageError(error.message);
    }
  };

  // Validate address
  const validateAddress = async () => {
    setAddressValidationResult(null);
    setAddressValidationError(null);
    try {
      const response = await fetch('/validate_address/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postal_code: address.postalCode,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to validate address');
      }
      const data = await response.json();
      setAddressValidationResult(data);
    } catch (error) {
      setAddressValidationError(error.message);
    }
  };

  React.useEffect(() => {
    fetchTasks();
    fetchMessages();
  }, [agent]);

  if (!loggedIn) {
    return <LoginForm onLogin={handleLogin} />;
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

      <section style={{ marginTop: 40 }}>
        <h2>Validate Address</h2>
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
        <button onClick={validateAddress}>Validate</button>
        {addressValidationResult && (
          <div>
            {addressValidationResult.valid ? (
              <p style={{ color: 'green' }}>Address is valid</p>
            ) : (
              <p style={{ color: 'red' }}>
                Address is invalid: {addressValidationResult.reason}
              </p>
            )}
          </div>
        )}
        {addressValidationError && (
          <p style={{ color: 'red' }}>Error: {addressValidationError}</p>
        )}
      </section>

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
        <div>
          <h3>Messages</h3>
          {messageError && <p style={{ color: 'red' }}>Error: {messageError}</p>}
          {messages.length === 0 ? (
            <p>No messages</p>
          ) : (
            <ul>
              {messages.map((msg) => (
                <li key={msg.id}>
                  <strong>{msg.subject}</strong> from {msg.sender}
                  <p>{msg.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Send New Message</h3>
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
            value={newMessage.body}
            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>AI Agent Tasks</h2>
        <div>
          <input
            placeholder="New task description"
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
          >
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
          <input
            placeholder="Tags (comma separated)"
            type="text"
            value={newTaskTags}
            onChange={(e) => setNewTaskTags(e.target.value)}
          />
          <input
            placeholder="Related Documents (comma separated URLs or IDs)"
            type="text"
            value={newTaskRelatedDocs}
            onChange={(e) => setNewTaskRelatedDocs(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div>
          {tasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.description}</strong> - Status: {task.status}
                  {task.result && <p>Result: {task.result}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Research Analytics Dashboard</h2>
        <p>{researchSummary}</p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Send Research Analysis Task to AI</h2>
        <textarea
          placeholder="Describe the research analysis task"
          rows={4}
          style={{ width: '100%' }}
          value={researchTaskDescription}
          onChange={(e) => setResearchTaskDescription(e.target.value)}
        />
        <button onClick={sendResearchAnalysis}>Send Analysis Task</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Revenue Optimizer</h2>
        <button onClick={fetchRevenueOpportunities}>Identify Revenue Opportunities</button>
        {revenueOpportunities.length > 0 && (
          <ul>
            {revenueOpportunities.map((opportunity) => (
              <li key={opportunity.id}>
                {opportunity.description} - Potential Revenue: ${opportunity.potential_revenue.toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AppUpdated;
