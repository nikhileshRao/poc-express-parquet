const Config = require('../config.json');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();
const app = express();
const port = 3000;

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

        const data = await response.text();
        //Logging data fetched from api
        console.log("the data", data)
    }
    catch(e){
        console.log("Error")
    }
}

// Route to fetch data from Adobe
app.get('/fetch-data-from-adobe', async (req, res) => {
    try {
        const data = await fetchAccessToken();
        res.send({ message: 'Data fetched successfully please check console'});
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});