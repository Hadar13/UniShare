require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const summaryRoutes = require('./routes/summaryRoutes');
const authRoutes = require('./routes/authRoutes');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.send('UniShare server is running');
});

app.use('/api/summaries', summaryRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;