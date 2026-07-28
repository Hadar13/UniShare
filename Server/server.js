const app = require('./app'); // לוקח את ההגדרות שכתבתי ב-app
const connectDB = require('./config/db'); // מביא את פונקציית החיבור למונגו

const PORT = process.env.PORT || 5000; // רץ על 5000

connectDB().then(() => { // קודם מתחבר למונגו
  app.listen(PORT, '127.0.0.1', () => { // אחרי החיבור מפעיל שרת
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
});