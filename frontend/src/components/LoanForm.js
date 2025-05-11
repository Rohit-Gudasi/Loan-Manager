import React, { useState } from 'react';
import axios from 'axios';

function LoanForm({ userId, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    tenure: '',
    reason: '',
    employmentStatus: '',
    employmentAddress: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.amount <= 0 || formData.tenure <= 0) {
      alert('Amount and Tenure must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/apply`, {
        ...formData,
        userId,
      });
      alert('Loan application submitted!');
      setFormData({
        fullName: '',
        amount: '',
        tenure: '',
        reason: '',
        employmentStatus: '',
        employmentAddress: '',
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Loan application error:', error);
      alert('Loan application failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    formContainer: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fdfdfd',
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '12px',
      margin: '10px 0',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '16px',
      transition: 'border 0.2s',
    },
    button: {
      marginTop: '20px',
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      alignSelf: 'center',
      width: '150px',
    },
  };

  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      <input
        style={styles.input}
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        type="number"
        name="tenure"
        placeholder="Tenure (in months)"
        value={formData.tenure}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        type="text"
        name="reason"
        placeholder="Reason for Loan"
        value={formData.reason}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        type="text"
        name="employmentStatus"
        placeholder="Employment Status"
        value={formData.employmentStatus}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        type="text"
        name="employmentAddress"
        placeholder="Employment Address"
        value={formData.employmentAddress}
        onChange={handleChange}
        required
      />
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Submitting...' : 'Apply'}
      </button>
    </form>
  );
}

export default LoanForm;
