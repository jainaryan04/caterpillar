import express from 'express';
import cors from 'cors';
import pg from "pg";
import dotenv from "dotenv";
import multer from 'multer';
dotenv.config();

const upload = multer();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
  db.connect();


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const result=await db.query("SELECT * from inspection") 
let index=result.rows[0].id+1;
console.log(index)

app.get('/id',async(req,res)=>{
    const result=await db.query("SELECT * from inspection") 
    let index=result.rows[0].id+1;
    
    res.json({index})
})

app.get('/api/reports/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const report = await db.query('SELECT * FROM inspection WHERE id = $1', [id]);
      if (report.rows.length > 0) {
        res.json(report.rows[0]);
      } else {
        res.status(404).json({ message: 'Report not found' });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


app.post('/api/header', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "INSERT INTO inspection (id, header) VALUES ($1, $2)",
        [index, formData]
    );    
    res.status(200).json({ message: 'Header data received successfully!' });
});

app.post('/api/tyre', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "UPDATE inspection SET tyre = $1 WHERE id = $2",
        [formData, index]
    );
    res.status(200).json({ message: 'Header data received successfully!' });
});

app.post('/api/engine', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "UPDATE inspection SET engine = $1 WHERE id = $2",
        [formData, index]
    );
    res.status(200).json({ message: 'Engine data received successfully!' });
});

app.post('/api/brake', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "UPDATE inspection SET brake = $1 WHERE id = $2",
        [formData, index]
    );
    res.status(200).json({ message: 'Brake data received successfully!' });
});

app.post('/api/battery', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "UPDATE inspection SET battery = $1 WHERE id = $2",
        [formData, index]
    );
    res.status(200).json({ message: 'Battery data received successfully!' });
});

app.post('/api/exterior', upload.none(), async(req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    await db.query(
        "UPDATE inspection SET exterior = $1 WHERE id = $2",
        [formData, index]
    );
    res.status(200).json({ message: 'Exterior data received successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
