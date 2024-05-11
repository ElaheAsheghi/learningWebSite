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

exports.changeRole = async (req, res) => {
    const {id} = req.body;
    const isValidUserId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidUserId) {
        res.status(409).json({
            message: "This user id is not valid."
        })
    };

    const user = await userModel.findOne({_id: id});

    if(!user) {
        res.status(404).json({
            message: "User not found!"
        })
    };

    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await userModel.findOneAndUpdate(
        {_id: id},
        {
            role: newRole
        }
    );

    if(!updatedUser) {
        res.status(500).json({
            message: "Server error!"
        })
    };

    res.status(200).json({
        message: "User role has updated successfully."
    })
    
};