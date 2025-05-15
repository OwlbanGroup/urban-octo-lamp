import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
  });

  test('renders package tracking section', () => {
    render(<App />);
    expect(screen.getByText(/Track Package/i)).toBeInTheDocument();
  });

  test('validates address', async () => {
    axios.get.mockResolvedValueOnce({ data: { valid: true } });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Street/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'CityA' } });
    fireEvent.change(screen.getByPlaceholderText(/State/i), { target: { value: 'StateA' } });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'CountryA' } });
    fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByText(/Validate/i));
    await waitFor(() => expect(screen.getByText(/Valid: Yes/i)).toBeInTheDocument());
  });

  test('sends a new message and fetches messages', async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Recipient/i), { target: { value: 'agent2' } });
    fireEvent.change(screen.getByPlaceholderText(/Subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByPlaceholderText(/Message body/i), { target: { value: 'Test message body' } });
    fireEvent.click(screen.getByText(/Send/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  test('creates a new task and fetches tasks', async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/New task description/i), { target: { value: 'Test task' } });
    fireEvent.click(screen.getByText(/Add Task/i));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
