import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Global AI Postal System heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Global AI Postal System/i);
  expect(headingElement).toBeInTheDocument();
});
