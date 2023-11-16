const { Server } = require("socket.io");

const init = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
        },
    });
    io.on('connection', socket => {
        console.log('connection made to socket.io');
        socket.emit('connected','connected to socket.io');
        try{
            

            // socket.on('setup',(userData)=>{
            //     socket.join(userData.id);
            //     console.log('user with userId ' + userData.id + ' connected');
            //     socket.emit('connected','user '+ userData.id +' connected');
            // });

            // socket.on('putmessage',(user)=>{
            //     const {id,message} = user;
            //     io.to(id).emit('getmessage',message);
            // });        

            socket.on('joinGameSession',(data)=>{
                const {userId,gameSessionId} = data;
                socket.join(gameSessionId);
                console.log(`user with id ${userId} joined game ${gameSessionId}`)
                socket.emit('connected',`user with id ${userId} joined game ${gameSessionId}`)
            });

        }catch(err){
            console.log(err);
        }
    });
}

module.exports = {
    init
}