const User = require('./model');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require('../config');
const utils  = require("../utils/get-token");

async function register(req,res,next){
    try {
        const payload = req.body;

        const user = new User(payload);
        
        await user.save();

        return res.json(user);

    } catch (error) {
        if(error && error.name === "ValidationError"){
            return res.json({
                error : 1,
                message : error.message,
                fields : error.errors
            })
        }
        next(error);
    }
}

async function localStrategy(email, password, done){
    try {
        let user = await 
        User
        .findOne({email})
        .select(`-__v -createdAt -updatedAt -cart_items -token`);
        
        //stop if is user is not found
        if(!user) return done();
        
        //checking user password
        if(bcrypt.compareSync(password, user.password)){
            ({password, ...userWithoutPassword } = user.toJSON())

            // return user data without password
            return done(null, userWithoutPassword)
        }
    } catch (error) {
        done(error, null)
    }
    done();
}

async function login(req, res, next){
    passport.authenticate('local', async function(error, user){
        // retur error if error
        if(error) return next(error);        
        if(!user) return res.json({
            error : 1,
            message : `Email or password are incorrect`
        }) // return error if user is not found
        // if founded
        // make json web token
        let signed = jwt.sign(user, config.secretKey);
        // save token in the user
        await User.findOneAndUpdate(
            {_id : user._id},
            {$push : { token : signed}},
            {new : true}
        );
        // response to the client
        return res.json({
            message : 'logged in successfully',
            user : user,
            token : signed
        })
    })(req, res, next)
}


async function logout(req, res, next){
    let token = utils.getToken(req);

    let user = await User.findOneAndUpdate({
        token : {
            $in : [token]
        }
    }, {
        $pull : {token}
    }, 
    {
        useFindAndModify : false
    });
    // log out failed
    if(!user || !token){
        return res.json({
            error : 1,
            message : "No user found"
        })
    }
    // log out success
    return res.json({
        error : 0,
        message : "Logout berhasil"
    });
}

// to get know if user already sign in or not
function me(req, res, next){
    if(!req.user){
        return res.json({
            error : 1,
            message : `You are not login or token expired`
        });
    }
    return res.json(req.user)
}

module.exports = {
    register,
    localStrategy,
    login, 
    me, 
    logout
}