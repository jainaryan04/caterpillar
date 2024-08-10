const express = require('express');
const cors = require('cors');

const multer = require('multer');
const upload = multer();


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.post('/log', (req, res) => {
    const { text } = req.body;
    console.log('Logged Text:', text);
    res.status(200).send('Text logged successfully');
});

app.post('/api/tyre', upload.none(), (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);

    res.status(200).json({ message: 'Form data received successfully!' });
});


  app.post('/api/exterior', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    // Here you can add code to save the data to a database, etc.
  
    res.status(200).json({ message: 'Form data received successfully!' });
  });

  app.post('/api/engine', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    // Here you can add code to save the data to a database, etc.
  
    res.status(200).json({ message: 'Form data received successfully!' });
  });

  app.post('/api/brake', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    // Here you can add code to save the data to a database, etc.
  
    res.status(200).json({ message: 'Form data received successfully!' });
  });

  app.post('/api/battery', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    // Here you can add code to save the data to a database, etc.
  
    res.status(200).json({ message: 'Form data received successfully!' });
  });



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
