import mongoose from 'mongoose';
import User from './model.js';



async function connectDB() {
    try{
        await mongoose.connect(`mongodb+srv://ashwinprajapati2601_db_user:5ZjXF5sLXlUP5xyP@cluster0.t8fsdke.mongodb.net/test?appName=Cluster0`);
        
        console.log("connected to the mongoDB database");
    }catch(err){
        console.log(`error connecting to DB, error:${err}`);
    }
}

export default connectDB;