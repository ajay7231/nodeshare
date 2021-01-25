const express = require('express');

const app = express()
const PORT = process.env.PORT || 3000;

const connectDb = require('./config/db');
connectDb();

app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/show'))

app.listen(PORT,()=>{
    console.log(`listening on port : ${PORT}`);
})