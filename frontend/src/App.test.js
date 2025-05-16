import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

const renderApp = () => {
  return render(<App />);
};

test('renders Global AI Postal System heading', () => {
  renderApp();
  const headingElement = screen.getByText(/Global AI Postal System/i);
  expect(headingElement).toBeInTheDocument();
});

test('fetches and displays package info on track package', async () => {
  const mockPackage = {
    sender: 'Alice',
    recipient: 'Bob',
    status: 'In Transit',
    estimated_delivery_days: 3
  };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockPackage,
  });

  renderApp();
  const input = screen.getByPlaceholderText(/Enter Package ID/i);
  const button = screen.getByRole('button', { name: /Track/i });

  fireEvent.change(input, { target: { value: '123' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText((content, element) => content.includes('Sender: Alice'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Recipient: Bob'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Status: In Transit'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Estimated Delivery Days: 3'))).toBeInTheDocument();
  });
});

test('fetches and displays messages for agent', async () => {
  const mockMessages = [
    { id: '1', sender: 'agent1', subject: 'Hello', body: 'Test message', timestamp: new Date().toISOString() }
  ];
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockMessages,
  });

  renderApp();
  expect(await screen.findByText(/Hello/i)).toBeInTheDocument();
});
