const jwt = require("jsonwebtoken");

const { createChat } = require("../repositories/MessageRepository");
const {checkChatAndVideoCallCount} = require('../utils/checkChatAndVideoCallCount')
 
const JWT_SECRET = process.env.JWT_SECRET;
const users = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("authenticate", async(token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        users[decoded.userId] = socket.id;
        socket.userId = decoded.userId;
        console.log(`User registered: ${decoded.userId}`);
        await checkChatAndVideoCallCount(decoded.userId)
        console.log("Current users:", users);
      } catch (error) {
        console.log("Authentication error:", error);
        socket.disconnect();
      }
    });
    
    socket.on(
      "sendMessage",
      async ({
        to,
        message,
        mediaType,
        mediaUrl,
        mediaSize,
        from,
        timestamp,
      }) => {
        const senderId = socket.userId;
        console.log(`Sending message from ${senderId} to ${to}: ${message}`);

        if (!users[to]) {
          console.log(`User ${to} is offline.`);
          return;
        }

        try {
          // if (mediaType === "text") {
          //   await createChat({ message, senderId, receiverId: to, mediaType });
          // } else{
            await createChat({
              senderId,
              receiverId: to,
              mediaUrl,
              mediaSize,
              mediaType,
              message
            });
          // }
          // const savedMessage = await Message.create({ message, senderId, receiverId: to });
          // console.log('Message saved to DB:');

          io.to(users[to]).emit("receiveMessage", {
            from: senderId,
            message,
            to: to,
            timestamp,
            mediaUrl,
            mediaSize,
            mediaType,
          });
          console.log(`Message sent to ${to}: ${message}`);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} logged out.`);
          break;
        }
      }
    });
  });
};

module.exports = socketHandler;



