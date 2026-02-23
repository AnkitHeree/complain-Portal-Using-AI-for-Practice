const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/complaintDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const JWT_SECRET = "mysecretkey";

/* ================= SCHEMAS ================= */

const complaintSchema = new mongoose.Schema({
    name:String,
    email:String,
    department:String,
    message:String
});

const adminSchema = new mongoose.Schema({
    username:String,
    password:String
});

const Complaint = mongoose.model("Complaint",complaintSchema);
const Admin = mongoose.model("Admin",adminSchema);

/* ================= ADMIN REGISTER ================= */

app.post("/adminRegister", async(req,res)=>{
    const {username,password} = req.body;

    const existing = await Admin.findOne({username});
    if(existing){
        return res.json({message:"Admin already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await Admin.create({
        username,
        password:hashedPassword
    });

    res.json({message:"Admin Registered"});
});

/* ================= ADMIN LOGIN ================= */

app.post("/adminLogin", async(req,res)=>{
    const {username,password} = req.body;

    const admin = await Admin.findOne({username});
    if(!admin) return res.json({message:"User not found"});

    const isMatch = await bcrypt.compare(password,admin.password);
    if(!isMatch) return res.json({message:"Wrong password"});

    const token = jwt.sign({id:admin._id},JWT_SECRET,{expiresIn:"1h"});

    res.json({token});
});

/* ================= VERIFY TOKEN ================= */

function verifyToken(req,res,next){
    const token = req.headers.authorization;

    if(!token) return res.json({message:"Access denied"});

    try{
        jwt.verify(token,JWT_SECRET);
        next();
    }catch{
        res.json({message:"Invalid Token"});
    }
}

/* ================= ADD COMPLAINT ================= */

app.post("/addComplaint", async(req,res)=>{
    await Complaint.create(req.body);
    res.json({message:"Complaint Submitted"});
});

/* ================= GET COMPLAINTS ================= */

app.get("/getComplaints", verifyToken, async(req,res)=>{
    const complaints = await Complaint.find();
    res.json(complaints);
});

/* ================= START SERVER ================= */

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});