import { render, screen, fireEvent } from '@testing-library/react';
import React, { act as reactAct } from 'react';
import App from '../App';

test('renders login form and allows input', () => {
  reactAct(() => {
    render(<App />);
  });
  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();

  fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  expect(usernameInput.value).toBe('user@example.com');
  expect(passwordInput.value).toBe('password');
});