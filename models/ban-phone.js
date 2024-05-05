const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } //its for createdAt and updatedAt fields
);

const model = mongoose.model("BanUser", schema);

module.exports = model;
