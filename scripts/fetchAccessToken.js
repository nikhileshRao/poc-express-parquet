const Config = require('../config.json');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('path');

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

const bodyData = {
    grant_type: Config?.getAccessToken?.grant_type,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    scope: Config?.getAccessToken?.scope
}

const url = Config?.getAccessToken?.url;

const formBody = Object.keys(bodyData).map(key => 
    encodeURIComponent(key) + '=' + encodeURIComponent(bodyData[key])
).join('&');

//Fetching access token
const getAccessToken = async (url,formBody) => {
    try {
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        storeAccessToken(result.access_token);

    }catch (error) {
        console.error('Error posting data:', error);
    }
}

getAccessToken(url,formBody);