const mongoose = require("mongoose");
const {connectionUrl, } =  require("../config/kyes")
const connectMongoDB = async ()=>{
    try {
       
        await mongoose.connect(connectionUrl);
        console.log("database connection succesful");

    }catch(error){
        console.log(error.message);
    }
}

module.exports  = connectMongoDB