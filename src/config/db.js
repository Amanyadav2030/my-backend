const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = ()=>{
    return mongoose.connect(process.env.MONGO_URL);
};
module.exports=dbConnect;