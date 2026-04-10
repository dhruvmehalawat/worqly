const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const newEntry = {
    name,
    email,
    company,
    message,
    date: new Date()
  };

  const filePath = path.join(__dirname, 'submissions.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    const submissions = data ? JSON.parse(data) : [];
    submissions.push(newEntry);

    fs.writeFile(filePath, JSON.stringify(submissions, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving data.' });
      }
      res.json({ message: 'Thank you! We will contact you soon.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

