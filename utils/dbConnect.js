const mongoose = require("mongoose");

function dbConnect(){
    try {
        mongoose.connect(process.env.MONGODB_URL).then(() => {
            console.log("Connected to MongoDB");
        })
    } catch (error) {
        console.log("error in mongo",error);
    }
}

module.exports = dbConnect