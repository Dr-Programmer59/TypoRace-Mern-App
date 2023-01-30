const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: createRoomID } = require("uuid")


const port = process.env.PORT || 3001;
let users = [];
let rooms = {};

const app = express();
app.use(cors);
const server = http.createServer(app);

const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket) => {
    console.log("User connected")
    // NEW USER JOIN THE RACE 
    socket.on("join-room", (data) => {
        // // console.log("user joined") 
        // // console.log(data)
        let socketId = Object.values(data)[0]
        let users_data = {
            socket_id: socketId,
            car: Math.floor((Math.random() * 6) + 1),
            user_name: Object.keys(data)[0],
        };
        users.push(users_data)
        // console.log(socketId)
        let usersTosend = [];
        users.map((value, index) => {
            if (value['socket_id'] == socketId) {
                usersTosend.push(value);
            }
        })



        console.log(users)

        socket.join(socketId)
        io.to(socketId).emit("new-user", usersTosend)
        console.log(rooms)


    })

    socket.on("check-admin", ({ socketId }) => {
        console.log(socketId)
        socket.to(socketId).to(rooms[socketId]['admin id']).emit("is-admin", { admin: true })


    })
    socket.on("start-race", ({ roomId }) => {
        io.to(roomId).emit("started-race", { start: true })

    })
    socket.on("create-room", (data) => {
        const roomId = createRoomID();
        // console.log("Created the roomD")
        socket.join(roomId);
        let roomData = {
            'room name': data['name'],
            'admin id': data['userId'],
            'position': 1
        }

        rooms[roomId] = roomData;



        let user = {}
        user[data['name']] = roomId;

        io.to(data['userId']).emit("created-room", user);

    })

    socket.on("send_message", (data) => {
        console.log(data)
        let new_data = {}

        new_data[Object.keys(data)[0]] = Object.values(data)[0]

        socket.broadcast.to(data['socket_id']).emit("receive_message", new_data);

    })
    socket.on("complete-race", ({ user_name, roomId }) => {
        let position = rooms[roomId]['position'];
        rooms[roomId]['position'] += 1;
        let datatoS = {};
        datatoS[user_name] = position;
        io.to(roomId).emit("position-assign", datatoS)


    })
    socket.on("disconnect-race",({roomId})=>{
        console.log("disconnecting race")
        delete rooms[roomId];
        let indexes=[];
        users.map((value,index)=>{
            if(roomId==value['socket_id']){
                indexes.push(index);
            }

        })
        indexes.map((value,index)=>{
            delete users[value];
        })
        
        console.log(rooms)
        console.log(users)
    })
    socket.on("check-room",({roomId,socket_id})=>{
        console.log("check")
        console.log(socket_id)
        io.to(socket_id).emit("checked-room",{check:rooms[roomId]?true:false,roomId})

    })
})
server.listen(port, () => console.log(`Listening on port ${port}`));
