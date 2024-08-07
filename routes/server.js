const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req,res) => {
    console.log("welcome");
})

//Importing routes
const retrieveParquetRouter = require('./retrieveParquet');
const retrieveParquetAPIRouter = require('./retrieveParquetApi');
const fetchJWTToken = require('./fetchAccessToken');

app.use('/api' , retrieveParquetRouter);
app.use('/api' , retrieveParquetAPIRouter);
app.use('/api' , fetchJWTToken);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});