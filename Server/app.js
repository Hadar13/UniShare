require('dotenv').config(); // הכנה לקובץ .env

const express = require('express');
const cors = require('cors'); // הכנה לחיבור עתידי מול React
const summaryRoutes = require('./routes/summaryRoutes'); // מביא את ה-routes של הסיכומים
const authRoutes = require('./routes/authRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(logger);
app.use(helmet());

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/', (req, res) => {
  res.send('UniShare server is running');
});

// חיבור ה-routes של הסיכומים לשרת
app.use('/api/summaries', summaryRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app; // מייצאת את האפליקציה כדי ש־server.js יוכל להפעיל אותה