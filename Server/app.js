require('dotenv').config(); // הכנה לקובץ .env

const express = require('express');
const cors = require('cors'); // הכנה לחיבור עתידי מול React
const summaryRoutes = require('./routes/summaryRoutes'); // מביא את ה-routes של הסיכומים
const authRoutes = require('./routes/authRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();


app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('UniShare server is running');
});

// חיבור ה-routes של הסיכומים לשרת
app.use('/api/summaries', summaryRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app; // מייצאת את האפליקציה כדי ש־server.js יוכל להפעיל אותה
