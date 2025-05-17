import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

global.fetch = jest.fn();

describe('Revenue Optimizer Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url === '/ai/revenue_opportunities') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            opportunities: [
              { id: '1', description: 'Opportunity 1', potential_revenue: 10000 },
              { id: '2', description: 'Opportunity 2', potential_revenue: 20000 },
            ],
          }),
        });
      }
      if (url.startsWith('/ai/get_responses/')) {
        // Return empty array of tasks for AITaskManager fetch
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
      // Default mock for other fetch calls
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });
  });

  test('fetches and displays revenue opportunities', async () => {
    await act(async () => {
      render(<App initialLoggedIn={true} apiKey="default-secure-api-key" />);
    });

    // Click to show AI Task Manager to reveal the button
    const showAITaskManagerButton = screen.getByText(/Show AI Task Manager/i);
    await act(async () => {
      fireEvent.click(showAITaskManagerButton);
    });

    const button = await screen.findByText('Identify Revenue Opportunities');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(/Opportunity 1/)).toBeInTheDocument();
      expect(screen.getByText(/Opportunity 2/)).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Potential Revenue') && content.includes('10000'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Potential Revenue') && content.includes('20000'))).toBeInTheDocument();
    });
  });

  test('handles fetch failure gracefully', async () => {
    fetch.mockImplementation((url) => {
      if (url === '/ai/revenue_opportunities') {
        return Promise.resolve({ ok: false });
      }
      if (url.startsWith('/ai/get_responses/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });

    await act(async () => {
      render(<App initialLoggedIn={true} apiKey="default-secure-api-key" />);
    });

    // Click to show AI Task Manager to reveal the button
    const showAITaskManagerButton = screen.getByText(/Show AI Task Manager/i);
    await act(async () => {
      fireEvent.click(showAITaskManagerButton);
    });

    const button = await screen.findByText('Identify Revenue Opportunities');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole('listitem').length).toBe(0);
    });
  });
});
