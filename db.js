const mongoose = require("mongoose");

const connectdb = async () => {
    try {
     const connect= await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.4xbc1bg.mongodb.net/test1?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`).then(()=> {
        console.log("Patched to database....");
     });
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = connectdb;
