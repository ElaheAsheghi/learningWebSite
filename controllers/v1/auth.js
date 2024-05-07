const userModel = require('../../models/user');
const registerValidator = require('../../validators/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const banUserModel = require('../../models/ban-phone');

exports.register = async (req, res) => {
    const validationResult = registerValidator(req.body); //check information validation
    if(validationResult != true) {
        return res.status(422).json(validationResult)
    }

    const { username, name, email, phone, password } = req.body;

    const isUserExist = await userModel.findOne({ //check that if there is any
        $or: [{ username }, { email }],           //user with this username or email
    });

    const isUserBan = await banUserModel.find({ phone })

    if(isUserBan.length) {
        return res.status(409).json({
            message: "This phone is banned!"
        })
    };

    if(isUserExist) {
        return res.status(409).json({
            message: "username or email is duplicated."
        });
    };
    const countOfUsers = await userModel.countDocuments();
    const hashedPassword = await bcrypt.hash(password, 10); //here we use await keyWord so no need to hashSync
    const user = await userModel.create(
        {
            username,
            name,
            email,
            phone,
            password: hashedPassword,
            role: countOfUsers > 0 ? "USER" : "ADMIN",
        }
    );

    const userObject = user.toObject(); //change user to js object format
    Reflect.deleteProperty(userObject, "password"); //delete password property from user 
                                                    //to show user without password to client

    //we should create a token for any user  //payload data/secretKey/options
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30 day" });

    return res.status(201).json({ user: userObject, accessToken }); //return user and the token we have made
};                                                      //to frontEnd

exports.login = async (req, res) => {
    const { identifier, password } = req.body;
    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if(!user){
        return res.status(401).json({
            message: "There is no user with this username or email!"
        });
    };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({
            message: "Password is not valid!"
        });
    };

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30 day",
    });

    return res.status(200).json({
        accessToken
    });
};

exports.getMe = async (req, res) => {

};