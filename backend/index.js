const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/log', (req, res) => {
    const { text } = req.body;
    console.log('Logged Text:', text);
    res.status(200).send('Text logged successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
