import { Server } from 'socket.io'

const io = new Server(5000, {
    cors: {
        origin: "http://127.0.0.1:3000",
        // methods: ["GET", "POST"]
    }
});

let onlineUsers = [];

const addUser = (userId,socketId) => {
    const userExists = onlineUsers.find(user => user.userId === userId);
    if(userExists){
        return;
    }
    onlineUsers.push({userId,socketId});
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    

    socket.on("newUser", (user) => {
        addUser(user, socket.id);
    });

    socket.on('sendMessage', ({receiverId, data}) => {
        const user = getUser(receiverId);
        console.log('data',data)
        if(user){
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
    });

    socket.on('test', (msg) => {
        console.log('test: ' + msg);
    });
});