const User=require("../models/user2");
// const {v4:uuidv4}=require("uuid");
const {setUser,getUser}=require("../service/auth")

async function handleUserSignup(req,res){
    
    const {name,email,password}=req.body;

    await User.create({
        name,
        email,
        password,
    })
    // redirect to static_router means home 
    return res.redirect("/");
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user = await User.findOne({ email, password }); // Check both fields
    
    if(!user)
        {return res.render("login",{
            error:"Invalid username or password"
        })};

    const token=setUser(user);
    //making cookie
    res.cookie('token',token);
    return  res.redirect("/");
}
module.exports={
    handleUserSignup,handleUserLogin
}