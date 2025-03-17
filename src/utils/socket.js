const jwt = require("jsonwebtoken");

const { createChat } = require("../repositories/MessageRepository");
const { checkChatAndVideoCallCount } = require("../utils/checkChatAndVideoCallCount");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const UserRepository = require("../repositories/UserRepository");
const {update, create} = require('../repositories/RtcTokenRepository')

const JWT_SECRET = process.env.JWT_SECRET;
const users = {}; // Stores online users (userId -> socketId)
const activeSessions = {}; // Stores active chat sessions (userId -> Set of modelIds)

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Authenticate user
    socket.on("authenticate", async (token) => {
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


    //  Video call events

    socket.on('call-initiated', async ({ callerId, receiverId, channelName }) => {
      io.emit(`incoming-call-${receiverId}`, { callerId, channelName });
  });
  
  socket.on('call-status', async ({ callerId, receiverId, status }) => {
      if (status === 'ended') {
          await update({ status, endTime: new Date() }, callerId, receiverId);
      } else {
          await create({ callerId, receiverId, status });
      }
      io.emit(`call-status-${receiverId}`, { callerId, status });
  });


    // Handle sending messages
    socket.on("sendMessage", async ({ to, message, mediaType, mediaUrl, mediaSize, from, timestamp }) => {
      const senderId = socket.userId;
      console.log("Getting sender id=============>", senderId)
      console.log(`Sending message from ${senderId} to ${to}: ${message}`);

      const getUser = await UserRepository.findById(senderId);

      if (getUser && getUser.role_id === 3) {
        console.log("Active Users: =====================> ", users);
        console.log("Active Chat Sessions: =====================> ", activeSessions);

        // Store active session if not already stored
        if (!activeSessions[senderId]) {
          activeSessions[senderId] = new Set();
        }
        activeSessions[senderId].add(to);

        // Check chat count
        const response = await checkChatAndVideoCallCount(getUser.id);
        console.log(response, "response");
        if (response.error) {
          return socket.emit("chat_count_exceed", { message: response.error });
        }
      }

      // If recipient is offline, return early
      if (!users[to]) {
        await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message });
        console.log(`User ${to} is offline.`);
        return;
      }

      try {
        await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message });

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
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      let disconnectedUserId = null;

      for (let userId in users) {
        if (users[userId] === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        delete users[disconnectedUserId];
        console.log(`User ${disconnectedUserId} logged out.`);

        // Only reduce chat count if user had an active session
        if (activeSessions[disconnectedUserId] && activeSessions[disconnectedUserId].size > 0) {
          console.log(`Ending chat session for ${disconnectedUserId}`);
          activeSessions[disconnectedUserId].clear();
          delete activeSessions[disconnectedUserId];

          const subscription = await SubscriptionRepository.getByUser(disconnectedUserId);
          if (subscription) {
            await SubscriptionRepository.update(subscription.id, {
              coins: subscription.coins === 0 ? 0 : subscription.coins - 5,
            });
            console.log(`Chat count reduced for user ${disconnectedUserId}`);
          }
        }
      }
    });
  });
};

module.exports = socketHandler;









// const jwt = require("jsonwebtoken");

// const { createChat } = require("../repositories/MessageRepository");
// const {
//   checkChatAndVideoCallCount,
// } = require("../utils/checkChatAndVideoCallCount");
// const SubscriptionRepository = require("../repositories/SubscriptionRepository");
// const UserRepository = require("../repositories/UserRepository");

// const JWT_SECRET = process.env.JWT_SECRET;
// const users = {};
// const activeSessions = {}; // Store active chat sessions (user -> model)

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("authenticate", async (token) => {
//       try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         users[decoded.userId] = socket.id;
//         socket.userId = decoded.userId;
//         console.log(`User registered: ${decoded.userId}`);
//         console.log("Current users:", users);
//       } catch (error) {
//         console.log("Authentication error:", error);
//         socket.emit("error", { message: "Authentication failed!" });
//         socket.disconnect();
//       }
//     });

//     socket.on(
//       "sendMessage",
//       async ({
//         to,
//         message,
//         mediaType,
//         mediaUrl,
//         mediaSize,
//         from,
//         timestamp,
//       }) => {
//         const senderId = socket.userId;
//         console.log(`Sending message from ${senderId} to ${to}: ${message}`);

//         const getUser = await UserRepository.findById(senderId);
//         if (getUser && getUser.role_id == 3) {
//           // Store active session
//           console.log("Active Users ========>", users)
//           console.log("Active Chat Sessions ===========>", activeSessions)
//           if (!activeSessions[senderId]) {
//             activeSessions[senderId] = to;
//           }

//           const response = await checkChatAndVideoCallCount(getUser.id);
//           console.log(response,"response")
//           if (response.error) {
//            return socket.emit("chat_count_exceed", {message:response.error})

//           }
//         }
//         // const getUser = await UserRepository.findById(senderId)
//         // if(getUser && getUser.role_id == 3){
//         //   const response = await checkChatAndVideoCallCount(getUser.id);
//         //   if(response.error){
//         //     socket.emit(("error", {message: response.error}));
//         //     return;
//         //   }
//         //   const subscription = await SubscriptionRepository.getByUser(getUser.id);
//         //   if(subscription){
//         //     await SubscriptionRepository.update(subscription.id, { chat_count: subscription.chat_count - 1 });
//         //   }
//         // }

//         if (!users[to]) {
//           console.log(`User ${to} is offline.`);
//           return;
//         }

//         try {
//           await createChat({
//             senderId,
//             receiverId: to,
//             mediaUrl,
//             mediaSize,
//             mediaType,
//             message,
//           });

//           io.to(users[to]).emit("receiveMessage", {
//             from: senderId,
//             message,
//             to: to,
//             timestamp,
//             mediaUrl,
//             mediaSize,
//             mediaType,
//           });
//           console.log(`Message sent to ${to}: ${message}`);
//         } catch (error) {
//           console.error("Error saving message:", error);
//         }
//       }
//     );

//     socket.on("disconnect", async () => {
//       console.log("User disconnected:", socket.id);
//       for (let userId in users) {
//         if (users[userId] === socket.id) {
//           delete users[userId];
//           console.log(`User ${userId} logged out.`);

//           // If the user had an active chat session with a model, decrement chat count
//           if (activeSessions[userId]) {
//             console.log(`Ending chat session for ${userId}`);
//             delete activeSessions[userId];

//             const subscription = await SubscriptionRepository.getByUser(userId);
//             if (subscription) {
//               await SubscriptionRepository.update(subscription.id, {
//                 chat_count: subscription.chat_count === 0 ? 0 :subscription.chat_count - 1,
//               });
//               console.log(`Chat count reduced for user ${userId}`);
//             }
//           }

//           delete users[userId];

//           break;
//         }
//       }
//     });
//   });
// };

// module.exports = socketHandler;









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


