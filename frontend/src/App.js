import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [packageId, setPackageId] = useState('');
  const [packageInfo, setPackageInfo] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });
  const [addressValidation, setAddressValidation] = useState(null);

  const handleTrackPackage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/packages/" + packageId);
      setPackageInfo(response.data);
    } catch (error) {
      setPackageInfo(null);
      alert('Package not found');
    }
  };

  const handleValidateAddress = async () => {
    try {
      const response = await axios.get('http://localhost:8000/validate_address/', { params: address });
      setAddressValidation(response.data);
    } catch (error) {
      setAddressValidation(null);
      alert('Error validating address');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Global AI Postal System</h1>

      <section>
        <h2>Track Package</h2>
        <input
          type="text"
          placeholder="Enter Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        />
        <button onClick={handleTrackPackage}>Track</button>
        {packageInfo && (
          <div>
            <h3>Package Info:</h3>
            <p>Sender: {packageInfo.sender}</p>
            <p>Recipient: {packageInfo.recipient}</p>
            <p>Status: {packageInfo.status}</p>
            <p>Estimated Delivery Days: {packageInfo.estimated_delivery_days}</p>
          </div>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Validate Address</h2>
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
        />
        <button onClick={handleValidateAddress}>Validate</button>
        {addressValidation && (
          <div>
            <p>Valid: {addressValidation.valid ? 'Yes' : 'No'}</p>
            {!addressValidation.valid && <p>Reason: {addressValidation.reason}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
