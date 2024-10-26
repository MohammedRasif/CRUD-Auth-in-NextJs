import mongoose from "mongoose";

let isConnected=false

export const connectToDB=async()=>{
    mongoose.set('strictQuery',true)

    if(isConnected){
        console.log("Mongo is already connected")
        return
    }

    try{
        await mongoose.connect('mongodb+srv://curd:rasif123456@cluster0.kp0kv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

        isConnected=true
        console.log("connected to mongodb")
    }
    catch(e){
        console.log(e)
    }



}