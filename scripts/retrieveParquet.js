const express = require('express');
const path = require('path');
const parquet = require('parquetjs');

const app = express();
const port = 3000;

// Route to read and parse the Parquet file
app.get('/read-parquet', async (req, res) => {
    try {
        // Path to your Parquet file
        const filePath = path.join(__dirname,'../data', 'sample.parquet');
        
        // Open and read the Parquet file
        const reader = await parquet.ParquetReader.openFile(filePath);
        const cursor = reader.getCursor();
        const data = [];

        // Read and log each record
        while (record = await cursor.next()) {
            data.push(record);
            console.log(record);
        }

        await reader.close();

        res.json({ message: 'Parquet file data is', data});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading Parquet file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
