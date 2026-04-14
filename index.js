require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Log every incoming request so we can debug 404s
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/user', require('./routes/userRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// 404 catch-all
app.use((req, res) => {
  console.log(`[404] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Final Error handling middleware
app.use((err, req, res, next) => {
  console.error('CRITICAL SERVER ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Backend Error', 
    message: err.message 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running strictly on IPv4 port ${PORT}`);
});
