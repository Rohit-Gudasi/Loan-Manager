require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require('./models/User');
const LoanApplication = require('./models/LoanApplication');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB connection error:', err));

// Admin credentials
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ userId: user._id, fullName: user.fullName });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({ admin: true });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Submit Loan Application
app.post('/api/apply', async (req, res) => {
  try {
    const loan = new LoanApplication(req.body);
    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Loans by User
app.get('/api/user/loans/:userId', async (req, res) => {
  const loans = await LoanApplication.find({ userId: req.params.userId });
  res.json(loans);
});

// Admin: Get All Loan Applications
app.get('/api/admin/applications', async (req, res) => {
  const loans = await LoanApplication.find();
  res.json(loans);
});

// Admin: Update Loan Status
app.put('/api/admin/update-status/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedLoan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedLoan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
