const userModel = require('../../models/user');
const banUserModel = require('../../models/ban-phone');
const mongoose = require('mongoose');

exports.banUser = async (req, res) => {
    const mainUser = await userModel.findOne({ _id: req.params.id }).lean();
    const banUserResult = banUserModel.create({ phone: mainUser.phone });

    if(banUserResult) {
        return res.status(200).json({ message: "User have banned successfully :))" })
    };

    return res.status(500).json({ message: "Server error!" });
};

exports.getAll = async (req, res) => {
    const users = await userModel.find({}).select("-password").lean();

    return res.status(200).json(users)
};

exports.removeUser = async (req, res) => {
    const isValidUserId = mongoose.Types.ObjectId.isValid(req.params.id);

    if(!isValidUserId) {
        return res.status(409).json({
            message: "User ID is not valid!"
        });
    };

    const removedUser = await userModel.findOneAndDelete({ _id: req.params.id });

    if(!removedUser) {
        return res.status(404).json({
            message: "There is no user with this user ID"
        });
    };

    return res.status(201).json({
        message: "User have deleted successfully"
    });
};