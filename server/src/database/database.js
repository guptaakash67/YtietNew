const mongoose = require("mongoose");

const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, { dbName: "ytiet" })
        .then((d) => {
            console.log(`Database connected at ${d.connection.host}`);
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = connectDB;
