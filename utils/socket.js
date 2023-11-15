const { Server } = require("socket.io");
const Message = require("../models");

const initializedSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
  });
};

module.exports = initializedSocket;