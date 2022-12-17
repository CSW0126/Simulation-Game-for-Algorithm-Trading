const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try{
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY)
        //decode jwt token and get username and id
        req.username = decoded.username
        req._id = decoded._id
        if (req.username && req._id){
           next() 
        }else{
            return res.status(401).json({
                message: "Auth failed",
                status: "fail"
            }) 
        }
    }catch(error){
        return res.status(401).json({
            message: "Auth failed",
            status: "fail"
        })
    }

}