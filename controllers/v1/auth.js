const userModel = require('../../models/user');
const registerValidator = require('../../validators/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const validationResult = registerValidator(req.body); //check information validation
    if(validationResult != true) {
        return res.status(422).json(validationResult)
    }

    const { username, name, email, phone, password } = req.body;

    const isUserExist = await userModel.findOne({ //check that if there is any
        $or: [{ username }, { email }],           //user with this username or email
    });

    if(isUserExist) {
        return res.status(409).json({
            message: "username or email is duplicated."
        });
    };
    const countOfUsers = await userModel.count();
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
    //we should create a token for any user  //payload data/secretKey/options
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30 day" });

    return res.status(201).json({ user, accessToken }); //return user and the token we have made
};                                                      //to frontEnd

exports.login = async (req, res) => {

};

exports.getMe = async (req, res) => {

};