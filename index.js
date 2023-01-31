const express = require('express');
require('dotenv').config();
require('./telBot');
const PORT = process.env.PORT || 8000

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello, world!");
})

app.listen(PORT, ()=> {
    console.log("listening on port " + PORT)
})