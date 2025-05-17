import React, { useState, useEffect } from 'react';

function AITaskManager({ apiKey, agent }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/ai/get_responses/${agent}`, {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (agent) {
      fetchTasks();
    }
  }, [agent]);

  const handleCreateTask = async () => {
    if (!newTaskDescription.trim()) return;
    setLoading(true);
    setError(null);
    const taskId = `task-${Date.now()}`;
    try {
      const response = await fetch('/ai/send_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey || 'default-secure-api-key',
        },
        body: JSON.stringify({ id: taskId, description: newTaskDescription }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      await response.json();
      setNewTaskDescription('');
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>AI Task Manager</h2>
      <div>
        <textarea
          rows={3}
          placeholder="Enter task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          style={{ width: '100%' }}
        />
        <button onClick={handleCreateTask} disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.description}</strong> - Status: {task.completed ? 'Completed' : 'Pending'}
              {task.result && <p>Result: {task.result}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AITaskManager;
