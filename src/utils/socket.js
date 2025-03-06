const jwt = require("jsonwebtoken");

const { createChat } = require("../repositories/MessageRepository");
const {checkChatAndVideoCallCount} = require('../utils/checkChatAndVideoCallCount')
const SubscriptionRepository = require('../repositories/SubscriptionRepository')
const UserRepository = require('../repositories/UserRepository')
 
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
        console.log("Current users:", users);
      } catch (error) {
        console.log("Authentication error:", error);
        socket.emit("error", { message: "Authentication failed!" });
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
        
        const getUser = await UserRepository.findById(senderId)
        if(getUser && getUser.role_id == 3){
          const response = await checkChatAndVideoCallCount(getUser.id);
          if(response.error){
            socket.emit(("error", {message: response.error}));
            return;
          }
          const subscription = await SubscriptionRepository.getByUser(getUser.id);
          if(subscription){
            await SubscriptionRepository.update(subscription.id, { chat_count: subscription.chat_count - 1 });
          }
        } 



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



// const activeChats = new Set(); // Track active chat sessions


    // socket.on('startChat', async ({to})=>{
    //   const senderId = socket.userId;
    //   if(!senderId || !to) return;

    //   const chatKey = `${senderId}-${to}`;

    //   if(!activeChats.has(chatKey)){
    //     try {
    //       await checkChatAndVideoCallCount(senderId);

    //       const plan = await PlanRepository.getByUserPlan(senderId);
    //       await PlanRepository.update(plan.id, { chat_count: plan.chat_count - 1 });

    //       activeChats.add(chatKey);
    //       console.log(`Chat session started between ${senderId} and ${to}, remaining chat count: ${plan.chat_count - 1}`);
    //     } catch (error) {
    //       console.error("Error starting chat:", error);
    //       socket.emit("chatError", { message: error.message });
    //     }
    //   }
    // })