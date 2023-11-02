const isAdmin =(req,res,next) =>{
    if(req.user.isAdmin){
        next()
    }else{
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}

module.exports = isAdmin