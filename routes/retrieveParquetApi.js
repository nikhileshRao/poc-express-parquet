const Config = require('../config.json');
const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const parquet = require('parquetjs-lite');

dotenv.config();

// Fetching the access token from Adobe
 const fetchAccessToken = async () => {
  
    const url = Config?.fetchDataFromAdobe?.url

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_ADOBE_X_API_KEY,
                'x-gw-ims-org-id': process.env.NEXT_PUBLIC_ADOBE_X_GW_IMS_ORG_ID,
                'x-sandbox-name': Config?.fetchDataFromAdobe?.sandbox_name,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADOBE_JWT_TOKEN}`
            }
        });

        const buffer = await response.arrayBuffer();
        const nodeBuffer = Buffer.from(buffer);

        const reader = await parquet.ParquetReader.openBuffer(nodeBuffer);

        // Read all records
        const records = [];
        const cursor = reader.getCursor();
        let record = null;
        while (record = await cursor.next()) {
        records.push(record);
        console.log("Records pushed" , records)
        }

        // Close the reader
        await reader.close();;
        }
    catch(e){
        console.log("Error")
    }
}

// Route to fetch data from Adobe
router.get('/fetch-data-from-adobe', async (req, res) => {
    try {
        const data = await fetchAccessToken();
        res.status(200).json({ message: 'Data fetched successfully please check console'});
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data' });
    }
});

module.exports = router