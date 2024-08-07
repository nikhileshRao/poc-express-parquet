const express = require('express');
const router = express.Router();
const path = require('path');
const parquet = require('parquetjs');


// Route to read and parse the Parquet file
router.get('/read-parquet', async (req, res) => {
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
        }

        await reader.close();
        
        res.status(200).json({ message: 'Parquet file data is', data});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading Parquet file');
    }
});

module.exports = router