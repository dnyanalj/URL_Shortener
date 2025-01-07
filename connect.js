
const mongoose=require("mongoose");
mongoose.set("strictQuery",true);

async function handleconnection(url)
{
    return mongoose.connect(url);
}
module.exports={handleconnection};