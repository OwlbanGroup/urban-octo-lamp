import React, { useState } from 'react';
import LoginForm from './LoginForm';

function App({ initialLoggedIn = false }) {
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Global AI Postal System</h1>

      <section>
        <h2>Track Package</h2>
        <input placeholder="Enter Package ID" type="text" />
        <button>Track</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Validate Address</h2>
        <input placeholder="Street" type="text" />
        <input placeholder="City" type="text" />
        <input placeholder="State" type="text" />
        <input placeholder="Country" type="text" />
        <input placeholder="Postal Code" type="text" />
        <button>Validate</button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>AI Agent Mail Inbox</h2>
        <div>
          <label htmlFor="agent-input">Agent:</label>
          <input id="agent-input" type="text" defaultValue="agent1" />
        </div>
        <div>
          <h3>Messages</h3>
          <p>No messages</p>
        </div>
        <div>
          <h3>Send New Message</h3>
          <input placeholder="Recipient" type="text" />
          <input placeholder="Subject" type="text" />
          <textarea placeholder="Message body" />
          <button>Send</button>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>AI Agent Tasks</h2>
        <div>
          <input placeholder="New task description" type="text" />
          <select>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
          <input placeholder="Tags (comma separated)" type="text" />
          <input placeholder="Related Documents (comma separated URLs or IDs)" type="text" />
          <button>Add Task</button>
        </div>
        <div>
          <p>No tasks</p>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Research Analytics Dashboard</h2>
        <p>Loading analytics...</p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Send Research Analysis Task to AI</h2>
        <textarea placeholder="Describe the research analysis task" rows={4} style={{ width: '100%' }} />
        <button>Send Analysis Task</button>
      </section>
    </div>
  );
}

export default App;
