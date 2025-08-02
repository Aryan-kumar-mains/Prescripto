import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI, {
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err) => {
        console.log(err);
    })

}

export default connectDB;