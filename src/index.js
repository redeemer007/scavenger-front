let express = require('express');
const mongoose = require("mongoose");
let bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');


const branches = require("./model/branchModel.js");

function dbConnect() {
    mongoose.connect(
        //"mongodb://localhost:27017/scavenger",
       "mongodb+srv://node_830:node830@firtstime-43hcc.mongodb.net/nodedb?retryWrites=true&w=majority",
        { useNewUrlParser: true },
        (error) => {
            if (!error) {
                console.log("Success connected");
            } else {
                console.log("Error connectiong to database");
            }
        }
    );
}

let clientSocketIds = [];
let connectedUsers = [];
app.use(cors())
//var jsonParser = bodyparser.json()
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
// app.get("/searchPincode/:pincode", async (req, res) => {
//     dbConnect();
//     const pincode = req.param.pincode;
//     socket.emit('message', pincode);
// })
app.get("/findPincode/:pincode", async (req, res) => {
    dbConnect();
    try {
        const fetchedPincode = await branches.find({ pincodeCovered: req.params.pincode });
        //socketCall(fetchedPincode);
        res.json(fetchedPincode);
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.get("/findAllBranches", async (req, res) => {
    dbConnect();
    try {
        const fetchedPincode = await branches.find({  });
        //socketCall(fetchedPincode);
        res.json(fetchedPincode);
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    dbConnect();
    let branchDetails = await branches.findOne({ branchName: req.body.username });
    if (branchDetails.password == req.body.password) {
        res.send({ status: true, data: branchDetails })
    } else {
        res.send({ status: false })
    }
})

const getSocketByUserId = (userId) => {
    let socket = '';
    for (let i = 0; i < clientSocketIds.length; i++) {
        if (clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

io.on('connection', socket => {
    console.log('conected')
    socket.on('disconnect', () => {
        console.log("disconnected")
        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('updateUserList', connectedUsers)
    });

    socket.on('loggedin', function (user) {
        console.log(user);
        clientSocketIds.push({ socket: socket, userId: user.branchName });
        connectedUsers = connectedUsers.filter(item => item.branchName != user.branchName);
        connectedUsers.push({ ...user, socketId: socket.id })
        user.pincodeCovered.map(pincode => {
            socket.join(pincode);
            console.log(socket);
        })
    });


    socket.on('message', function (data) {
        console.log(data);
        socket.emit('message', data);
    })

});


const port = process.env.PORT || 8082;
server.listen(port, () => {
  // console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Server running at ${port}`);
});