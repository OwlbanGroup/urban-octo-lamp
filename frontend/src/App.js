import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [packageId, setPackageId] = useState('');
  const [packageInfo, setPackageInfo] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });
  const [addressValidation, setAddressValidation] = useState(null);

  // New states for AI agent mail system
  const [agent, setAgent] = useState('agent1');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    body: ''
  });
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleTrackPackage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/packages/" + packageId);
      setPackageInfo(response.data);
    } catch (error) {
      setPackageInfo(null);
      alert('Package not found');
    }
  };

  const handleValidateAddress = async () => {
    try {
      const response = await axios.get('http://localhost:8000/validate_address/', { params: address });
      setAddressValidation(response.data);
    } catch (error) {
      setAddressValidation(null);
      alert('Error validating address');
    }
  };

  // Fetch messages for the agent
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messages/${agent}`);
      setMessages(response.data);
    } catch (error) {
      alert('Error fetching messages');
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    try {
      await axios.post('http://localhost:8000/messages/', {
        sender: agent,
        recipient: newMessage.recipient,
        subject: newMessage.subject,
        body: newMessage.body
      });
      setNewMessage({ recipient: '', subject: '', body: '' });
      fetchMessages();
    } catch (error) {
      alert('Error sending message');
    }
  };

  // Fetch tasks for the agent
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/${agent}`);
      setTasks(response.data);
    } catch (error) {
      alert('Error fetching tasks');
    }
  };

  // Create a new task
  const handleCreateTask = async () => {
    try {
      await axios.post('http://localhost:8000/tasks/', {
        agent: agent,
        description: newTaskDescription,
        completed: false
      });
      setNewTaskDescription('');
      fetchTasks();
    } catch (error) {
      alert('Error creating task');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchTasks();
  }, [agent]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Global AI Postal System</h1>

      <section>
        <h2>Track Package</h2>
        <input
          type="text"
          placeholder="Enter Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        />
        <button onClick={handleTrackPackage}>Track</button>
        {packageInfo && (
          <div>
            <h3>Package Info:</h3>
            <p>Sender: {packageInfo.sender}</p>
            <p>Recipient: {packageInfo.recipient}</p>
            <p>Status: {packageInfo.status}</p>
            <p>Estimated Delivery Days: {packageInfo.estimated_delivery_days}</p>
          </div>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Validate Address</h2>
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
        />
        <button onClick={handleValidateAddress}>Validate</button>
        {addressValidation && (
          <div>
            <p>Valid: {addressValidation.valid ? 'Yes' : 'No'}</p>
            {!addressValidation.valid && <p>Reason: {addressValidation.reason}</p>}
          </div>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>AI Agent Mail Inbox</h2>
        <div>
          <label>Agent: </label>
          <input type="text" value={agent} onChange={(e) => setAgent(e.target.value)} />
        </div>
        <div>
          <h3>Messages</h3>
          {messages.length === 0 && <p>No messages</p>}
          {messages.map((msg) => (
            <div key={msg.id} style={{ border: '1px solid black', marginBottom: '10px', padding: '5px' }}>
              <p><strong>From:</strong> {msg.sender}</p>
              <p><strong>Subject:</strong> {msg.subject}</p>
              <p>{msg.body}</p>
              <p><small>{new Date(msg.timestamp).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
        <div>
          <h3>Send New Message</h3>
          <input
            type="text"
            placeholder="Recipient"
            value={newMessage.recipient}
            onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subject"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
          />
          <textarea
            placeholder="Message body"
            value={newMessage.body}
            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>AI Agent Tasks</h2>
        <div>
          <input
            type="text"
            placeholder="New task description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <button onClick={handleCreateTask}>Add Task</button>
        </div>
        <div>
          {tasks.length === 0 && <p>No tasks</p>}
          {tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid black', marginBottom: '10px', padding: '5px' }}>
              <p>{task.description}</p>
              <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
              <p>Due: {task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
