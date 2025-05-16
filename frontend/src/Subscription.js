import React, { useState } from 'react';

function Subscription({ apiKey, onSubscriptionChange }) {
  const [priceId, setPriceId] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [error, setError] = useState(null);

  const createCheckoutSession = async () => {
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      const data = await response.json();
      setCheckoutUrl(data.checkout_url);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Subscription Management</h2>
      <input
        type="text"
        placeholder="Enter Stripe Price ID"
        value={priceId}
        onChange={(e) => setPriceId(e.target.value)}
      />
      <button onClick={createCheckoutSession}>Subscribe</button>
      {checkoutUrl && (
        <div>
          <p>Checkout session created. Please proceed to payment:</p>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            Go to Checkout
          </a>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Subscription;
