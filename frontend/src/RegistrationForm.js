import React, { useState } from 'react';

function RegistrationForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting registration form');
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName, password }),
      });
      console.log('Received response:', response);
      if (!response.ok) {
        const data = await response.json();
        console.log('Error response data:', data);
        throw new Error(data.detail || 'Registration failed');
      }
      setSuccessMessage('Registration successful! You can now log in.');
      console.log('Registration successful, updating state');
      setEmail('');
      setFullName('');
      setPassword('');
      setConfirmPassword('');
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      console.log('Caught error:', err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      {error && <p data-cy="error-message" role="alert" aria-live="assertive" style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p data-cy="success-message" role="alert" aria-live="assertive" style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
