const app = require('./app'); //לוקח את ההגדרות שכתבתי בapp

const PORT = process.env.PORT || 5000; // רץ על 5000

app.listen(PORT, '127.0.0.1', () => { //הפעלת שרת
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});