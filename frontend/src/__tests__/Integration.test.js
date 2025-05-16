import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

global.fetch = jest.fn();

describe('Revenue Optimizer Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches and displays revenue opportunities', async () => {
    const mockOpportunities = {
      opportunities: [
        { id: '1', description: 'Opportunity 1', potential_revenue: 10000 },
        { id: '2', description: 'Opportunity 2', potential_revenue: 20000 },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpportunities,
    });

    render(<App initialLoggedIn={true} />);

    const button = screen.getByText('Identify Revenue Opportunities');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Opportunity 1/)).toBeInTheDocument();
      expect(screen.getByText(/Opportunity 2/)).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Potential Revenue') && content.includes('10000'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Potential Revenue') && content.includes('20000'))).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/ai/revenue_opportunities', expect.any(Object));
  });

  test('handles fetch failure gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<App initialLoggedIn={true} />);

    const button = screen.getByText('Identify Revenue Opportunities');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
