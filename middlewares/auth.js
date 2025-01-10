const {getUser}=require("../service/auth");

// authentication
function checkForAuthentication(req,res,next)
{
    const tokenCookie=req.cookies?.token;
    req.user=null;
    if(!tokenCookie) return next();
    const user=getUser(tokenCookie);
    req.user=user;
    return next();
}
// authorization
function restrictTo(roles)
{
    return function (req,res,next)
    {
        // not logged in
        if(!req.user){return res.redirect("/login")}
        // loggedin but not authorized
        if(!roles.includes(req.user.role)){return res.end("Unauthorized");}
        return next();
    }
}
// module.exports={restrictToLogedinUserOnly,checkAuth}
module.exports={checkForAuthentication,restrictTo}