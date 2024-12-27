const mongoose = require("mongoose");

const connectdb = async () => {
    try {
     const connect= await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME_docker}:${process.env.DATABASE_PASSWORD_docker}@${process.env.DATABASE_CLUSTER_docker}`).then(()=> {
        console.log("Patched to database....");
     });
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = connectdb;
