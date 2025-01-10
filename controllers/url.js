const shortid = require("shortid")
const URL=require("../models/user")

async function handleGenerateNewShortURL(req,res){
    const shortID=shortid();
    const body=req.body;

    if(!body.url){return res.status(400).json({error:'url is required'})}

    await URL.create({
        shortId:shortID,
        redirectURL:req.body.url,
        visitHistory:[],
        createdBy:req.user._id
    });
    return res.render("home",{id:shortID});
    // again render the home page....

    // return res.json({id:shortID})
}
async function  handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory
    })
}

module.exports={
    handleGenerateNewShortURL,handleGetAnalytics
}

