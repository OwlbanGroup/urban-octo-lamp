import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Global AI Postal System App', () => {
  test('renders main heading', () => {
    render(<App initialLoggedIn={true} />);
    const heading = screen.getByText(/Global AI Postal System/i);
    expect(heading).toBeInTheDocument();
  });

  test('package tracking input and button', () => {
    render(<App initialLoggedIn={true} />);
    const input = screen.getByPlaceholderText(/Enter Package ID/i);
    const buttons = screen.getAllByText(/Track/i);
    const button = buttons.find(btn => btn.tagName.toLowerCase() === 'button');
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('address validation inputs and button', () => {
    render(<App initialLoggedIn={true} />);
    expect(screen.getByPlaceholderText(/Street/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/City/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/State/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Country/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Postal Code/i)).toBeInTheDocument();
    const buttons = screen.getAllByText(/Validate/i);
    const button = buttons.find(btn => btn.tagName.toLowerCase() === 'button');
    expect(button).toBeInTheDocument();
  });

  test('AI Agent Mail Inbox renders and can change agent', () => {
    render(<App initialLoggedIn={true} />);
    const agentInput = screen.getByLabelText(/Agent:/i);
    expect(agentInput).toBeInTheDocument();
    fireEvent.change(agentInput, { target: { value: 'agent2' } });
    expect(agentInput.value).toBe('agent2');
  });

  test('New message form inputs and send button', () => {
    render(<App initialLoggedIn={true} />);
    expect(screen.getByPlaceholderText(/Recipient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message body/i)).toBeInTheDocument();
    const buttons = screen.getAllByText(/^Send$/i);
    const button = buttons.find(btn => btn.tagName.toLowerCase() === 'button');
    expect(button).toBeInTheDocument();
  });

  test('AI Agent Tasks inputs and add task button', () => {
    render(<App initialLoggedIn={true} />);
    expect(screen.getByPlaceholderText(/New task description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tags \(comma separated\)/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Related Documents \(comma separated URLs or IDs\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });

  test('Research Analytics Dashboard displays loading initially', () => {
    render(<App initialLoggedIn={true} />);
    expect(screen.getByText(/Loading analytics/i)).toBeInTheDocument();
  });

  test('Send Research Analysis Task textarea and button', () => {
    render(<App initialLoggedIn={true} />);
    expect(screen.getByPlaceholderText(/Describe the research analysis task/i)).toBeInTheDocument();
    expect(screen.getByText(/Send Analysis Task/i)).toBeInTheDocument();
  });
});
