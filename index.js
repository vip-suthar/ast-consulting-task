const express = require('express');
require('dotenv').config();
require('./telBot');


const app = express();

app.get('/', (req, res)=>{
    res.send("Hello, world!");
})

app.listen(process.env.PORT, ()=> {
    console.log("listen on port " + process.env.PORT)
})