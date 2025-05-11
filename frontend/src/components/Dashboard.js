// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoanForm from './LoanForm';

function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const userId = localStorage.getItem('userId');
  const fullName = localStorage.getItem('fullName');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchLoans();
    else navigate('/login');
  }, [userId, navigate]);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/loans/${userId}`);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
      alert('Error fetching loan details.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={styles.pendingBadge}>PENDING</span>;
      case 'VERIFIED':
        return <span style={styles.verifiedBadge}>VERIFIED</span>;
      case 'APPROVED':
        return <span style={styles.approvedBadge}>APPROVED</span>;
      case 'REJECTED':
        return <span style={styles.rejectedBadge}>REJECTED</span>;
      default:
        return <span style={styles.defaultBadge}>UNKNOWN</span>;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.dashboardHeading}>{fullName}'s Dashboard</h2>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>

      {/* Loan Applications */}
      <div style={styles.tableContainer}>
        <h3 style={styles.subHeading}>Your Loan Applications</h3>
        {loans.length === 0 ? (
          <p style={styles.noLoans}>No loan applications found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Amount (₹)</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Tenure</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.td}>{loan.amount}</td>
                  <td style={styles.td}>{loan.reason}</td>
                  <td style={styles.td}>{loan.tenure} months</td>
                  <td style={styles.tdStatus}>
                    {getStatusBadge(loan.status)} {/* Applying the status badge */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Loan Form Toggle */}
      <button style={styles.formButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Loan Form' : 'Apply for a New Loan'}
      </button>

      {/* Loan Form Component */}
      {showForm && <LoanForm userId={userId} onSuccess={fetchLoans} />}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #6a11cb, #1f78d1)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  dashboardHeading: {
    color: '#E5E4E2',
    fontSize: '2.5rem',
  },
  logout: {
    padding: '10px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  subHeading: {
    color: '#ffffff',
    marginBottom: '1rem',
    fontSize: '1.5rem',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '14px',
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'center', // Ensures header cells are centered like body cells
  },
  td: {
    padding: '14px', // Ensure padding is consistent with header
    borderBottom: '1px solid #e0e0e0',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'center', // Ensures all cells are aligned in the center
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  formButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    marginTop: '30px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '18px',
  },
  noLoans: {
    textAlign: 'center',
    padding: '20px',
    color: '#333',
  },
  tdStatus: {
    textAlign: 'center',
    padding: '12px',
    verticalAlign: 'middle',
  },
  pendingBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    backgroundColor: '#f1c40f',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  approvedBadge: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  rejectedBadge: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  defaultBadge: {
    backgroundColor: '#7f8c8d',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
};

export default Dashboard;
