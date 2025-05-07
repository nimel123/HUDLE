import {  MongoClient } from "mongodb";
const client=new MongoClient('mongodb+srv://rameshnimel934:X9udcJNySRNrbpQu@hudleapi.zirn5ev.mongodb.net/?retryWrites=true&w=majority&appName=HudleAPI');
let db;

const Connection=async()=>{
    try{
           await client.connect();
              console.log("Connected to MongoDB");
              db=client.db('HudleAPI');
              return db;
    }
    catch(err){
        console.log(err);
    }
}

export default Connection;