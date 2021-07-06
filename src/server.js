let express = require('express');
const mongoose = require("mongoose");
let bodyParser = require('body-parser');
const path = require('path');
const app = express();
//const app = express.Router();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');


const branches = require("./model/branchModel.js");

function dbConnect() {
    mongoose.connect(
        "mongodb://localhost:27017/scavenger",
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

// app.use(express.static('app'));
// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules',)));
//app.use(bodyparser.json())

let clientSocketIds = [];
let connectedUsers = [];
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'chat'
// });
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
    // connection.query(`SELECT user_name, user_id, user_full_name, user_image from chat_users where user_name="${req.body.username}" AND user_password="${req.body.password}"`, function (error, results, fields) {
    //     if (error) throw error;

    //     if (results.length == 1) {
    //         res.send({ status: true, data: results[0] })
    //     } else {
    //         res.send({ status: false })
    //     }
    // });
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

/* socket function starts */
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
        //  io.emit('updateUserList', connectedUsers)
    });

    // socket.on('create', function (data) {
    //     console.log("create room")
    //     socket.join(data.room);
    //     let withSocket = getSocketByUserId(data.withUserId);
    //     socket.broadcast.to(withSocket.id).emit("invite", { room: data })
    // });
    // socket.on('joinRoom', function (data) {
    //     socket.join(data.room.room);
    // });

    socket.on('message', function (data) {
        console.log(data);
        socket.emit('message', data);
    })

});
/* socket function ends */

server.listen(8082, function () {
    console.log("server started")
});