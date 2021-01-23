const mongoose = require('mongoose');
require('dotenv').config();

connectDb = ()=>{

    mongoose.connect(process.env.MONGO_CONN_URL,{useNewUrlParser:true,
    useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});

    const conn = mongoose.connection;

    conn.once('open',()=>{
        console.log('database connected')
    }).catch(err =>{
        console.log(err);
    })

}

module.exports =  connectDb;