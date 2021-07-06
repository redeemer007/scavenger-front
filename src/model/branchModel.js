const mongoose = require("mongoose");

var BranchSchema = new mongoose.Schema({
    institutionName: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    contactNumber: [String],
    branchIncharge: {
        type: String,
        required: true,
    },
    pincodeCovered: [String],
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("branches", BranchSchema);

