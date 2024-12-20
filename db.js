const mongoose = require("mongoose");

const connectdb = async () => {
    try {
     const connect= await mongoose.connect("mongodb+srv://ketchupash999:subhashini@cluster0.4xbc1bg.mongodb.net/test1?retryWrites=true&w=majority&appName=Cluster0&authSource=admin").then(()=> {
        console.log("Patched to database....");
     });
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = connectdb;
