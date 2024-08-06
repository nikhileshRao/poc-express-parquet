const Config = require('../config.json');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('path');
const express = require('express');

const app = express();
dotenv.config();

//Store jwt access token in env file
const storeAccessToken = (accessToken) =>{
 // Set the environment variable and override any existing value
  process.env.NEXT_PUBLIC_ADOBE_JWT_TOKEN = accessToken;

  // Update value in .env file
  const envFilePath = path.join(__dirname,'../', '.env');
  const existingEnv = fs.readFileSync(envFilePath, 'utf8');
  const updatedEnv = existingEnv.replace(
    /^NEXT_PUBLIC_ADOBE_JWT_TOKEN=.*/m,
    `NEXT_PUBLIC_ADOBE_JWT_TOKEN=${accessToken}`
  );
  fs.writeFileSync(envFilePath, updatedEnv, 'utf8');
  console.log("Data has been written to .env")
}

app.get('/fetch-jwt-accesstoken', async (req, res) => {
    try{
        const bodyData = {
            grant_type: Config?.getAccessToken?.grant_type,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            scope: Config?.getAccessToken?.scope
        }

        const formBody = Object.keys(bodyData).map(key => 
            encodeURIComponent(key) + '=' + encodeURIComponent(bodyData[key])
        ).join('&');

        //fetching jwt token from adobe
        const tokenData ={
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        }

        const url = Config?.getAccessToken?.url;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          const accessToken = data.access_token;
      
          console.log("The access token is", accessToken);
          await storeAccessToken(accessToken);

          res.json({ message: 'JWT Access token fetched and stored successfully', accessToken });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching the access token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});