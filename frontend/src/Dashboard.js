import React, { useEffect, useState } from 'react';

function Dashboard({ apiKey, agent }) {
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);
  const [researchSummary, setResearchSummary] = useState('Loading analytics...');
  const [revenueOpportunities, setRevenueOpportunities] = useState([]);
  const [packageStatus, setPackageStatus] = useState(null);

  useEffect(() => {
    fetchNewMessagesCount();
    fetchRecentMessages();
    fetchPendingTasksCount();
    fetchRecentTasks();
    fetchResearchSummary();
    fetchRevenueOpportunities();
  }, [agent]);

  const fetchNewMessagesCount = async () => {
    try {
      const response = await fetch(`/notifications/new_items/${agent}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNewMessagesCount(data.new_messages);
      setPendingTasksCount(data.new_tasks);
    } catch (error) {
      setNewMessagesCount(0);
      setPendingTasksCount(0);
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const response = await fetch(`/messages/${agent}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setRecentMessages(data.slice(0, 5));
    } catch (error) {
      setRecentMessages([]);
    }
  };

  const fetchPendingTasksCount = async () => {
    // Already fetched in notifications, so no separate call needed
  };

  const fetchRecentTasks = async () => {
    try {
      const response = await fetch(`/tasks/${agent}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      const pendingTasks = data.filter(task => !task.completed);
      setRecentTasks(pendingTasks.slice(0, 5));
    } catch (error) {
      setRecentTasks([]);
    }
  };

  const fetchResearchSummary = async () => {
    try {
      const response = await fetch('/research/tasks_summary');
      if (!response.ok) throw new Error('Failed to fetch research summary');
      const data = await response.json();
      setResearchSummary(
        `Total Tasks: ${data.total_tasks}, Completed: ${data.completed_tasks}, Completion Rate: ${(data.completion_rate * 100).toFixed(2)}%`
      );
    } catch (error) {
      setResearchSummary('Error loading analytics');
    }
  };

  const fetchRevenueOpportunities = async () => {
    try {
      const response = await fetch('/ai/revenue_opportunities', {
        headers: { 'X-API-KEY': apiKey || 'default-secure-api-key' },
      });
      if (!response.ok) throw new Error('Failed to fetch revenue opportunities');
      const data = await response.json();
      setRevenueOpportunities(data.opportunities || []);
    } catch (error) {
      setRevenueOpportunities([]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <section>
        <h2>Notifications</h2>
        <p>New Messages: {newMessagesCount}</p>
        <p>Pending Tasks: {pendingTasksCount}</p>
      </section>

      <section>
        <h2>Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <p>No recent messages</p>
        ) : (
          <ul>
            {recentMessages.map(msg => (
              <li key={msg.id}>
                <strong>{msg.subject}</strong> from {msg.sender}
                <p>{msg.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Pending Tasks</h2>
        {recentTasks.length === 0 ? (
          <p>No pending tasks</p>
        ) : (
          <ul>
            {recentTasks.map(task => (
              <li key={task.id}>
                <strong>{task.description}</strong> - Priority: {task.priority}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Research Analytics Summary</h2>
        <p>{researchSummary}</p>
      </section>

      <section>
        <h2>Revenue Opportunities</h2>
        {revenueOpportunities.length === 0 ? (
          <p>No revenue opportunities identified</p>
        ) : (
          <ul>
            {revenueOpportunities.map(opportunity => (
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

export default Dashboard;
