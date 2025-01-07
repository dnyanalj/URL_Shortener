const express=require("express")
const app=express();
const PORT=8001;
const urlRoute=require("./routes/url");
const URL=require("./models/user")
const {handleconnection}=require("./connect");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const staticRouter=require("./routes/staticRouter");

// connect 
handleconnection("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("mongodb connected");
});

// ejs dependencies
app.set("view engine","ejs"); 
const path=require('path');
app.set('views',path.resolve("./views"));

// app.get("/test",async (req,res)=>{
//     const allUrls=await URL.find({});
//     return res.render('home',{
//         urls:allUrls
//     });
// })


app.use("/url",urlRoute);
app.use("/",staticRouter);

app.get('/user/:shortId',async (req,res)=>{
    // if you send me that smallwala id which was allocated to you
    // i will redirect you to the original site which was passed by you to 
    // generate this id
    // and yes also update visithistory for that site
    // such that push current time when visit

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