//Its a middleware to determine that any token has send in header or not.
//we can check it if the token's user is admin or user in next function.

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

module.exports = async (req, res, next) => {
    const authHeader = req.header("Authorization")?.split(" ");

    if(authHeader?.length != 2) {
        return res.status(403).json({
            message: "This route is protected and you don't have permission to access it!"
        })
    };
    
    const token = authHeader[1]; //First index is token name that declared in request and second one
                                //is token.these are seperated by a space.like: Bearer gtrsryrdr567ddrhdh...
    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        //user id has saved in token
        const user = await userModel.findById(jwtPayload.id).lean(); 

        Reflect.deleteProperty(user, "password");
 
        req.user = user; //To give access to this user in next func and send user in req.
     
        next();
    } catch (error) {
        return res.json(error)
    };
};