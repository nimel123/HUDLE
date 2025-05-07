const { text } = require('express');
const { default: Connection } = require('../Connection/ConnectDb');
const DB = require('../Connection/ConnectDb');
const jwt = require('jsonwebtoken');
const jwtkey = "ramesh@123";
const nodemailer = require('nodemailer');
const { ObjectId, Collection } = require('mongodb');


//OTP API

const OTP = async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(otp);
        const { email } = req.body;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rnimel5@gmail.com',
                pass: "udbrhhhvpimubbxr"
            }
        });
        var mailOptions = {
            from: ' "HUDLE BOOKING PLATFORM" <rnimel5@gmail.com> ',
            to: email,

            subject: 'Welcome to Hudle Booking Platform',
            text: `Hello your One Time Password (OTP) is ${otp}. Please use this OTP to complete your registration.
        \n\nWelcome to Hudle Booking Platform! We are excited to have you on board.
        \n\nBest regards,
        \nThe Hudle Team ☺`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Email Sending Failed', error);
            }
            else {
                console.log('Email Sent: ' + info.response);
                return res.status(200).json({
                    result: otp,
                    message: "OTP Sent Successfully",
                });

            }
        });
    }
    catch (err) {
        res.send(err)
    }
}

//Sign Up Api
const SignUp = async (req, res) => {
    try {

        const db = await Connection();
        const collection = db.collection('Stadium');
        const { name, number, password, email, dob } = req.body;
        if (!name || !number || !email || !password) {
            return res.status(400).json({ message: 'Name, numbe, password and email are required' });
        }
        if (number.length != 10) {
            return res.status(400).json({ message: 'Number should be of 10 digits' });
        }
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const result = await collection.insertOne({ name, number, email, password, dob });
        if (result.acknowledged) {

            return res.status(200).json({
                message: "User Registered Successfully",
                result: {
                    name: name,
                    number: number,
                    password: password,
                    email: email,
                    dob: dob,
                }
            })
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//

const GetUser = async (req, res) => {
    try{
       const db = await Connection();
         const collection = db.collection('Stadium');
         const { id } = req.params;
         const result = await collection.findOne({ _id: new ObjectId(id) });
            if (result) {
                return res.status(200).json({
                    message: "User Found Successfully",
                    result: {
                        name: result.name,
                        number: result.number,
                        email: result.email,
                        dob: result.dob,
                        id: result._id,
                    }
                })
            }
            else {
                return res.status(400).json({ message: 'User not found' });
            }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


//Login API

const Login = async (req, res) => {
    try {
        const db = await Connection();
        const collection = db.collection('Stadium');
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const checkUser = await collection.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (checkUser.password != password) {
            return res.status(401).json({ message: 'Invalid Password' });
        }
        const token = jwt.sign({ email: checkUser.email }, jwtkey, { expiresIn: '1d' });
        res.status(200).json({
            message: "User Logged In Successfully",

            result: {
                id: checkUser._id,
                name: checkUser.name,
                number: checkUser.number,
                email: checkUser.email,
                UserId: checkUser._id,
                dob:checkUser.dob,
                auth: token,
            }
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Update API
const Update = async (req, res) => {
    try {
      jwt.verify(req.body.token,jwtkey,async(err)=>{
        if(err){
            return res.status(404).json({
                message:"Invalid Token Or Expired"
            })
        }
        else{
            const db = await Connection();
        const collection = db.collection('Stadium');
        const { name, email, dob } = req.body;
        const { id } = req.params;
        if (!name || !email || !dob) {
            return res.status(400).json({ message: 'Name, email and dob are required' });
        }
        const result = await collection.findOneAndUpdate({
            _id: new ObjectId(id)
        },
            {
                $set: {
                    name: name,
                    email: email,
                    dob: dob
                }
            },
        )
        if (result) {
            return res.status(200).json({
                message: "User Updated Successfully",
                result: {
                    name: name,
                    email: email,
                    dob: dob
                },
                result

            })
        }
        else {
            return res.status(400).json({ message: 'User not found' });
        }
        }
      })
       

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//DELETE API

const Delete=async(req,res)=>{
    try{
        jwt.verify(req.body.token,jwtkey,async(err)=>{
            if(err){
                return res.status(404).json({
                    message:"Invalid Token Or Expired"
                })
            }
            else{
        const db = await Connection();
        const collection = db.collection('Stadium');
        const { id } = req.params;
        const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
        if (result) {
            return res.status(200).json({
                message: "User Deleted Successfully",
                result: {
                    id: id,
                }
            })
        }
        else {
            return res.status(400).json({ message: 'User not found' });
        }
    }
})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const ForgetPassword=async(req,res)=>{
     try{
        const db=await Connection();
        const collection=db.collection('Stadium');
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required"});
        }
        const checkUser=await collection.findOneAndUpdate({email:email},
            {
                $set:{ password:password },
            }
        )
        if(checkUser){
            return res.status(200).json({
                message:"Password Updated Successfully",
                result:{
                    email:email,
                    password:password
                }
            })
        }
        else{
            return res.status(400).json({message:"User Not Found"});
        }
     }
     catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
     }
}



module.exports = { SignUp, OTP, Login, Update ,GetUser,Delete,ForgetPassword};
