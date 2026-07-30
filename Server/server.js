const app = require('./app'); // לוקח את ההגדרות שכתבתי ב-app
const connectDB = require('./config/db'); // מביא את פונקציית החיבור למונגו

const PORT = process.env.PORT || 5000; // רץ על 5000 או על הפורט של שירות הענן

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});