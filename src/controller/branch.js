const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const branches = require("../model/branchModel.js");

function socketCall(fetchedPincode) {
    var app = express();
    //var http = require("http").createServer(app);
    var io = require("socket.io")(server);


    io.listen(3001, function () {
        console.log("Successfully Connected to the Node server");

        io.on("connection", function (socket) {
            console.log("Auth value :" + socket.id);

            socket.on("sendNotification", function (fetchedPincode) {
                console.log(fetchedPincode);
                socket.broadcast.emit("sendNotification", fetchedPincode);
            });
        });
    })
}


router.get("/findPincode/:pincode", async (req, res) => {
    dbConnect();
    try {
        const fetchedPincode = await branches.find({ pincodeCovered: req.params.pincode });
        socketCall(fetchedPincode);
        res.json(fetchedPincode);
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;