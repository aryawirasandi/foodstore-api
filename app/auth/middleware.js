const { getToken } = require('../utils/get-token');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require("../auth/model");

function decodeToken(){
   return async function (req, res, next){
        try {
            let token = getToken(req);
            if(!token) return next();
            req.user = jwt.verify(token, config.secretKey);
            let user = await User.findOne({token : { $in : [token]}});
            // expired if user is not found
            if(!user){
                return res.json({
                    error : 1,
                    messsage : "Token expired"
                })
            }
        } catch (error) {
            if(error && error.name === "JsonWebTokenError"){
                return res.json({
                    error : 1,
                    message : error.message
                })
            }
            // tangani error lainnya
            next(error);
        }
        return next();
   }
}

module.exports = {
    decodeToken
}