import http from 'http';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import connectDB from './src/db/db-cnn.js';
import User from'./src/db/model.js';

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const port= process.env.PORT;

// These two lines replace the old __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

//  //Now this will work:
//  console.log(__dirname);           // prints the directory path of current file
//  console.log(__filename);          // prints full path to current file


const app = express();
connectDB();

//---------------server-------------------------------------------
const Myserver = http.createServer(app);                        // return an instance of server


    
const io = new Server(Myserver, {
    cors: {
        origin: "*",           // ← change this in production!
        methods: ["GET", "POST"]
    }
    
});

//-----------------------------jwt atuh habdling (middlewhare)------------------------------------------------

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
    });
};








//-------------------------------express Rout handling--------------------------------------------


// Add these two lines
app.use(express.json());          // ← parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));  // ← optional but useful (for form data)

// serving static file's
app.use(express.static("public"));

// ================= / ===================
app.get('/',(req,res)=>{
    
    console.log("this is /");
    res.sendFile(path.join(__dirname,'public','login.html'));
});

// =============== login ==================
app.post('/api/login',async (req,res)=>{
    console.log("POST /api/login");
    console.log("Received body:", req.body);     // ← debug line – very helpful

    
    console.log("we are here-->");
    try {
        const { userName, password } = req.body;
        console.log("we here 3->");
        
        // 1. Basic input validation
        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }
        console.log("we here 10->");
        // 2. Find user by username (case sensitive)
        const user = await User.findOne({ userName: userName.trim() });
        console.log("we here 20->");
        // 3. Username not found
        if (!user) {
            
            return res.status(401).json({
                
                success: false,
                message: "Invalid username or password"
            });
        }
        console.log("we here 2000->");
        // 4. Check password (plain text comparison - NOT SECURE in production!)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // 5. Login success
        // Here you would normally create a JWT/session, but for simplicity:

        const payload = {
            name: userName
            // iat & exp added automatically by jwt.sign if expiresIn is set
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '60m'          // short-lived access token (best practice)
        });
        
        

        return res.status(200).json({
            success: true,
            accessToken,
            message: "User logged in successfully",
            user: {
                id: user._id,
                userName: user.userName,
                createdAt: user.createdAt
            }
            // token: "jwt-token-here"   ← add this later when implementing auth
        });

    } catch(error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
});

//============= signup ==============

app.post('/api/Signup',async (req,res)=>{

    const {userName,password} = req.body;

    const Udata = {
        userName:userName,
        password:password
    };

    console.log("POST /api/signup");
    console.log("Received body:", req.body);

    const user = await User.findOne({userName: userName.trim()});

    if(!user){
        // save the user
        console.log("we r here 1",Udata);
        try {
            console.log("we r here 2",Udata);
            const user = new User(Udata);
            await user.save();
            console.log("we r here 3");
            
            return res.status(201).send(`success,,, ${userName}, you are registered!!`);
            console.log("we r here 4");
        } catch (err) {
            throw new Error(`Create failed: ${err.message}`);
        }

    }
    else{
        console.log("we some whare");
        throw new Error(`Create failed already exist`);
    }


});

// Authinticate the user that if it is still valid
app.get('/api/user',authenticateToken,(req,res)=>{
    
    res.status(201).json({
        username: req.user.name
    })
});



//============== loading user dashboard =====================

app.get('/render/dashboard', async (req, res) => {
    console.log("Dashboard endpoint hit");

    const result = await User.find({}).select('userName').lean();

    const usernameList = result.map(user => user.userName);

    res.json(usernameList);   // Returns: ["ashwinTm26", "john123", ...]
});






//------------------ Socket.io handling  -------------------------------------

io.use((socket,next)=>{
    const token = socket.handshake.auth.token

    if (!token) return next(new Error("Authentication required"));

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error("Invalid token"));
        socket.user = decoded;   // { userId, name }
        next();
    });
});

// online users hendling
const onlineUsers = new Map();

// When a user connects
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    onlineUsers.set(socket.user.name, socket.id);

    console.log(onlineUsers);

    
    
    // Listen for "privat" from this client
    socket.on("privat", (msg) => {
        console.log("Server hearing msg");
        console.log(msg);
        console.log(onlineUsers.get(msg.username));
        io.to(onlineUsers.get(msg.username)).emit('privat',msg);

    });


    //handling 'disconnect'
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        
    });
    
});





Myserver.listen(port,()=>{
    console.log('server started ')
});