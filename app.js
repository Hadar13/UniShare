const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('UniShare server is running');
});

const PORT = 5000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});