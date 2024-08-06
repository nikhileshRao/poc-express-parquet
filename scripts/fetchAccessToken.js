const Config = require('../config.json');
const dotenv = require('dotenv');

dotenv.config();

const bodyData = {
    grant_type: Config?.getAccessToken?.grant_type,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    scope: Config?.getAccessToken?.scope
}

const formBody = Object.keys(bodyData).map(key => 
    encodeURIComponent(key) + '=' + encodeURIComponent(bodyData[key])
).join('&');

console.log("formBody" ,formBody , bodyData)
//fetching jwt token from adobe

const tokenData ={
    method: 'POST',
    url: `${Config?.getAccessToken?.url}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
}

let accessToken; // Variable to store the obtained access token

// Fetching the access token from Adobe
fetch(tokenData.url, tokenData)
    .then(response => response.json())
    .then(data => {
        accessToken = data.access_token; // Storing the access token
        console.log("the access token is " , accessToken); // console log the jwt token access token
    })
    .catch(error => {
        console.error('Error:', error); // Handling errors during the token fetching process
    });


