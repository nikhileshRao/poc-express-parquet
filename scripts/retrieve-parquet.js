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
        let record = null;

        // Read and log each record
        while (record = await cursor.next()) {
            console.log(record);
        }

        await reader.close();

        // Send a simple response to indicate success
        res.send('Parquet file data has been logged to the console.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading Parquet file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
