require('dotenv').config(); //הכנה קובץ .env

const express = require('express');
const cors = require('cors'); //הכנה לחיבור עתידי מול React.

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('UniShare server is running');
});

module.exports = app; //מייצאת את האפליקציה כדי ש־server.js יוכל להפעיל אותה