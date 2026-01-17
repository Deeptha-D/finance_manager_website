// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (Atlas)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// -----------------------------------------------------
// MODELS
// -----------------------------------------------------

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

// -----------------------------------------------------
// AUTH CONFIG
// -----------------------------------------------------

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Auth middleware (protects routes)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // { userId, email }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verify error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// -----------------------------------------------------
// AUTH ROUTES
// -----------------------------------------------------

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// -----------------------------------------------------
// EXPENSE ROUTES (Update expenses, sheet, CSV)
// -----------------------------------------------------

// Create income/expense
app.post('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category) {
      return res
        .status(400)
        .json({ message: 'type, amount, and category are required' });
    }

    const expense = new Expense({
      userId: req.user.userId,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : Date.now(),
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error creating expense' });
  }
});

// Get all expenses (for sheet & reports)
app.get('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
});

// Download expenses as CSV
app.get('/api/expenses/export', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({
      date: -1,
    });

    const header = 'date,type,category,description,amount\n';
    const rows = expenses
      .map((e) =>
        [
          e.date.toISOString(),
          e.type,
          e.category,
          `"${(e.description || '').replace(/"/g, '""')}"`,
          e.amount,
        ].join(',')
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=expenses.csv'
    );
    res.send(header + rows);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error exporting CSV' });
  }
});

// -----------------------------------------------------
// DASHBOARD SUMMARY (top 3 cards)
// -----------------------------------------------------

app.get('/api/dashboard/summary', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const agg = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    agg.forEach((row) => {
      if (row._id === 'income') totalIncome = row.total;
      if (row._id === 'expense') totalExpense = row.total;
    });

    const remainingBalance = totalIncome - totalExpense;

    let status = 'Stable';
    if (remainingBalance < 0) status = 'Critical';
    else if (totalIncome > 0 && remainingBalance < totalIncome * 0.2)
      status = 'Low';

    res.json({
      totalExpense,
      remainingBalance,
      status,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error getting summary' });
  }
});

// -----------------------------------------------------
// ANALYTICS (for charts)
// -----------------------------------------------------

app.get('/api/analytics', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const byCategory = await Expense.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
    ]);

    const byMonth = await Expense.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: 1,
        },
      },
    ]);

    res.json({ byCategory, byMonth });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error getting analytics' });
  }
});

// -----------------------------------------------------
// NOTIFICATIONS (low / good balance)
// -----------------------------------------------------

app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const agg = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    agg.forEach((row) => {
      if (row._id === 'income') totalIncome = row.total;
      if (row._id === 'expense') totalExpense = row.total;
    });

    const remaining = totalIncome - totalExpense;
    const notifications = [];

    if (remaining < 0) {
      notifications.push({
        level: 'danger',
        text: 'Your balance is negative. Reduce expenses immediately.',
      });
    } else if (totalIncome > 0 && remaining < totalIncome * 0.2) {
      notifications.push({
        level: 'warning',
        text: 'Your balance is low for this period.',
      });
    } else {
      notifications.push({
        level: 'success',
        text: 'Your balance looks good. Keep it up!',
      });
    }

    res.json({
      remaining,
      totalIncome,
      totalExpense,
      notifications,
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ message: 'Server error getting notifications' });
  }
});

// -----------------------------------------------------
// SIMPLE REPORTS (you can extend later)
// -----------------------------------------------------

app.get('/api/reports/summary', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const byMonth = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    res.json(byMonth);
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ message: 'Server error getting reports' });
  }
});

// -----------------------------------------------------
// Test Route
// -----------------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Finance Manager API is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
