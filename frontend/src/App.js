import React, { useState, useEffect } from 'react';

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
  const [newTaskPriority, setNewTaskPriority] = useState(3);
  const [newTaskTags, setNewTaskTags] = useState('');
  const [newTaskRelatedDocs, setNewTaskRelatedDocs] = useState('');

  // Research analytics state
  const [tasksSummary, setTasksSummary] = useState(null);

  // Research analysis AI states
  const [researchAnalysisTask, setResearchAnalysisTask] = useState('');
  const [researchAnalysisResult, setResearchAnalysisResult] = useState(null);

  const handleTrackPackage = async () => {
    try {
      const response = await fetch("http://localhost:8000/packages/" + packageId);
      if (!response.ok) throw new Error('Package not found');
      const data = await response.json();
      setPackageInfo(data);
    } catch (error) {
      setPackageInfo(null);
      alert('Package not found');
    }
  };

  const handleValidateAddress = async () => {
    try {
      const params = new URLSearchParams(address).toString();
      const response = await fetch('http://localhost:8000/validate_address/?' + params);
      if (!response.ok) throw new Error('Error validating address');
      const data = await response.json();
      setAddressValidation(data);
    } catch (error) {
      setAddressValidation(null);
      alert('Error validating address');
    }
  };

  // Fetch messages for the agent
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${agent}`);
      if (!response.ok) throw new Error('Error fetching messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      alert('Error fetching messages');
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://localhost:8000/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: agent,
          recipient: newMessage.recipient,
          subject: newMessage.subject,
          body: newMessage.body
        })
      });
      if (!response.ok) throw new Error('Error sending message');
      setNewMessage({ recipient: '', subject: '', body: '' });
      fetchMessages();
    } catch (error) {
      alert('Error sending message');
    }
  };

  // Fetch tasks for the agent
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${agent}`);
      if (!response.ok) throw new Error('Error fetching tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      alert('Error fetching tasks');
    }
  };

  // Create a new task with extended fields
  const handleCreateTask = async () => {
    try {
      const tagsArray = newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const relatedDocsArray = newTaskRelatedDocs.split(',').map(doc => doc.trim()).filter(doc => doc.length > 0);
      const response = await fetch('http://localhost:8000/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: agent,
          description: newTaskDescription,
          completed: false,
          priority: newTaskPriority,
          tags: tagsArray,
          related_documents: relatedDocsArray
        })
      });
      if (!response.ok) throw new Error('Error creating task');
      setNewTaskDescription('');
      setNewTaskPriority(3);
      setNewTaskTags('');
      setNewTaskRelatedDocs('');
      fetchTasks();
      fetchTasksSummary();
    } catch (error) {
      alert('Error creating task');
    }
  };

  // Fetch research tasks summary
  const fetchTasksSummary = async () => {
    try {
      const response = await fetch('http://localhost:8000/research/tasks_summary');
      if (!response.ok) throw new Error('Error fetching tasks summary');
      const data = await response.json();
      setTasksSummary(data);
    } catch (error) {
      alert('Error fetching tasks summary');
    }
  };

  // Send research analysis task to AI
  const handleSendResearchAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:8000/ai/send_research_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': 'your-secure-api-key' },
        body: JSON.stringify({ task: researchAnalysisTask })
      });
      if (!response.ok) throw new Error('Error sending research analysis task');
      const data = await response.json();
      setResearchAnalysisResult(data);
    } catch (error) {
      alert('Error sending research analysis task');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchTasks();
    fetchTasksSummary();
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
          <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(parseInt(e.target.value))}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newTaskTags}
            onChange={(e) => setNewTaskTags(e.target.value)}
          />
          <input
            type="text"
            placeholder="Related Documents (comma separated URLs or IDs)"
            value={newTaskRelatedDocs}
            onChange={(e) => setNewTaskRelatedDocs(e.target.value)}
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
              <p>Priority: {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</p>
              <p>Tags: {task.tags.join(', ')}</p>
              <p>Related Documents: {task.related_documents.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Research Analytics Dashboard</h2>
        {tasksSummary ? (
          <div>
            <p>Total Tasks: {tasksSummary.total_tasks}</p>
            <p>Completed Tasks: {tasksSummary.completed_tasks}</p>
            <p>Completion Rate: {(tasksSummary.completion_rate * 100).toFixed(2)}%</p>
            <p>Priority Distribution:</p>
            <ul>
              <li>High: {tasksSummary.priority_distribution.high}</li>
              <li>Medium: {tasksSummary.priority_distribution.medium}</li>
              <li>Low: {tasksSummary.priority_distribution.low}</li>
            </ul>
          </div>
        ) : (
          <p>Loading analytics...</p>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Send Research Analysis Task to AI</h2>
        <textarea
          placeholder="Describe the research analysis task"
          value={researchAnalysisTask}
          onChange={(e) => setResearchAnalysisTask(e.target.value)}
          rows={4}
          style={{ width: '100%' }}
        />
        <button onClick={handleSendResearchAnalysis}>Send Analysis Task</button>
        {researchAnalysisResult && (
          <div>
            <h3>Analysis Result:</h3>
            <pre>{JSON.stringify(researchAnalysisResult, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
