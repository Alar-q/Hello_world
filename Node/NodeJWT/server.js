require('dotenv').config()

const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.json({ page: 'home' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
})