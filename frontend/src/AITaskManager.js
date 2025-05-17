import React, { useState, useEffect } from 'react';

function AITaskManager({ apiKey, agent }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [revenueOpportunities, setRevenueOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [errorOpportunities, setErrorOpportunities] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/ai/get_responses/' + agent, {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      // Ensure tasks is always an array
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRevenueOpportunities = async () => {
    setLoadingOpportunities(true);
    setErrorOpportunities(null);
    try {
      const response = await fetch('/ai/revenue_opportunities', {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) {
        setRevenueOpportunities([]); // Clear opportunities on error
        throw new Error('Failed to fetch revenue opportunities');
      }
      const data = await response.json();
      if (data.opportunities && Array.isArray(data.opportunities)) {
        setRevenueOpportunities(data.opportunities);
      } else {
        setRevenueOpportunities([]);
      }
    } catch (err) {
      setErrorOpportunities(err.message);
    } finally {
      setLoadingOpportunities(false);
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
    const taskId = 'task-' + Date.now();
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

      <button onClick={fetchRevenueOpportunities} disabled={loadingOpportunities} style={{ marginTop: 20 }}>
        {loadingOpportunities ? 'Identifying...' : 'Identify Revenue Opportunities'}
      </button>
      {errorOpportunities && <p style={{ color: 'red' }}>Error: {errorOpportunities}</p>}
      {revenueOpportunities.length > 0 && (
        <ul>
          {revenueOpportunities.map((opportunity) => (
            <li key={opportunity.id}>
              <strong>{opportunity.description}</strong> - Potential Revenue: {opportunity.potential_revenue}
            </li>
          ))}
        </ul>
      )}

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
