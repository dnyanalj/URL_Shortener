const express=require("express")
const app=express();
const PORT=8001;
const URL=require("./models/user")
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const {handleconnection}=require("./connect");
const {checkForAuthentication,restrictTo}=require("./middlewares/auth")

// to use cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// all routes
const urlRoute=require("./routes/url");
const staticRouter=require("./routes/staticRouter");
const userRoute=require("./routes/user");

// connect 
// handleconnection("mongodb+srv://dnyanalj:8hV9RcstGyBRs2Gp@cluster0.t1y1f.mongodb.net/short-url").then(()=>{
//     console.log("mongodb connected");
// });
require('dotenv').config();

handleconnection(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
});

// ejs dependencies
app.set("view engine","ejs"); 
const path=require('path');
app.set('views',path.resolve("./views"));

// actual code 

app.use(checkForAuthentication);

app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRoute);

app.use("/",staticRouter);

app.use("/user",userRoute);

app.get('/url/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
    // this will update visitcnt and 
    // will return findone by shortId which is document or entry in the database
    const entry=await URL.findOneAndUpdate({shortId},{$push:{visitHistory:{timestamp:Date.now()}}})
    // 3 asnar na in the schema 
    // visitHistory
    // shortId
    // redirectURL
    res.redirect(entry.redirectURL);
})
app.listen(PORT,()=>{
    console.log("Successfully running on port :",PORT);
})