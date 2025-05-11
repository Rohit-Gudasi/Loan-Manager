import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/applications`);
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
        toast.error('Error fetching loans. Please try again later.');
      }
    };
    fetchLoans();
  }, []);

  const handleStatusChange = (loan, status) => {
    setSelectedLoan(loan);
    setNewStatus(status);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/update-status/${selectedLoan._id}`, {
        status: newStatus,
      });
      toast.success('Loan status updated successfully');
      const updatedLoans = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/applications`);
      setLoans(updatedLoans.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating loan status:', error.message);
      toast.error('Error updating loan status. Please try again later.');
    }
  };

  const cancelStatusChange = () => {
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'VERIFIED': return '#2980b9';
      case 'APPROVED': return '#27ae60';
      case 'REJECTED': return '#c0392b';
      default: return '#7f8c8d';
    }
  };

  // Statistics
  const totalApplications = loans.length;
  const approvedCount = loans.filter(loan => loan.status === 'APPROVED').length;
  const rejectedCount = loans.filter(loan => loan.status === 'REJECTED').length;
  const pendingCount = loans.filter(loan => loan.status === 'PENDING').length;
  const verifiedCount = loans.filter(loan => loan.status === 'VERIFIED').length;
  const averageLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0) / (loans.length || 1);
  const successRate = ((approvedCount / (loans.length || 1)) * 100).toFixed(2);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.adminDashboardHeading}>Admin Dashboard</h2>
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem('admin');
            navigate('/admin-login');
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div style={styles.statsContainer}>
        <div style={styles.statBox}><strong>Total:</strong> {totalApplications}</div>
        <div style={styles.statBox}><strong>Approved:</strong> {approvedCount}</div>
        <div style={styles.statBox}><strong>Rejected:</strong> {rejectedCount}</div>
        <div style={styles.statBox}><strong>Pending:</strong> {pendingCount}</div>
        <div style={styles.statBox}><strong>Verified:</strong> {verifiedCount}</div>
        <div style={styles.statBox}><strong>Avg. Amount:</strong> ${averageLoanAmount.toFixed(2)}</div>
        <div style={styles.statBox}><strong>Success Rate:</strong> {successRate}%</div>
      </div>

      <h3 style={styles.subHeading}>All Loan Applications</h3>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Tenure</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Employment</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} style={styles.tr}>
                <td style={styles.td}>{loan.fullName}</td>
                <td style={styles.td}>${loan.amount}</td>
                <td style={styles.td}>{loan.tenure} months</td>
                <td style={styles.td}>{loan.reason}</td>
                <td style={styles.td}>{loan.employmentStatus}</td>
                <td style={styles.td}>{new Date(loan.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(loan.status)
                  }}>
                    {loan.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <select
                    value=""
                    onChange={(e) => handleStatusChange(loan, e.target.value)}
                    style={styles.dropdown}
                  >
                    <option value="" disabled>Change</option>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Confirm Status Change</h3>
            <p>Are you sure you want to mark this loan as <strong>{newStatus}</strong>?</p>
            <div style={styles.modalActions}>
              <button onClick={confirmStatusChange} style={styles.confirmButton}>Yes</button>
              <button onClick={cancelStatusChange} style={styles.cancelButton}>No</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Inter, sans-serif',
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  adminDashboardHeading: {
    color: '#fff',
    fontSize: '36px',
    fontWeight: '700',
    margin: 0,
  },
  logout: {
    padding: '10px 18px',
    backgroundColor: '#ff5e57',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '2rem',
    color: '#fff',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '12px 20px',
    borderRadius: '10px',
    minWidth: '120px',
    fontSize: '15px',
    fontWeight: '500',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  subHeading: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },
  th: {
    backgroundColor: '#3d5af1',
    color: '#fff',
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '14px',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#333',
    borderBottom: '1px solid #eee',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
  },
  tr: {
    borderRadius: '8px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  dropdown: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f8f8f8',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  },
  modalTitle: {
    marginBottom: '15px',
    fontSize: '20px',
    color: '#333',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default AdminDashboard;
