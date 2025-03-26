const jwt = require("jsonwebtoken");

const { createChat } = require("../repositories/MessageRepository");
const { checkChatAndVideoCallCount } = require("../utils/checkChatAndVideoCallCount");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const UserRepository = require("../repositories/UserRepository");
const {update, create} = require('../repositories/VideoCallRepository')
const {generateRtcToken} = require('../utils/generateRtcToken')

const JWT_SECRET = process.env.JWT_SECRET;
const users = {}; // Stores online users (userId -> socketId)
const activeSessions = {}; // Stores active chat sessions (userId -> Set of modelIds)
// const sessionTimeouts = {}

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Authenticate user
    socket.on("authenticate", async (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        users[decoded.userId] = socket.id;  // { '5': 'fUShNQMhk8XsrI0SAAA3', '37': '7Ci_1uM25wLJSp0qAAA1' }
        
        socket.userId = decoded.userId;
        console.log(`User registered: ${decoded.userId}`);
        console.log("Current users:", users);


        // startSessionTimeout(decoded.userId);


        
      } catch (error) {
        console.log("Authentication error:", error);
        socket.emit("error", { message: "Authentication failed!" });
        socket.disconnect();
      }
    });

    // const checkSessionExpiry = (userId) => {
    //   const sessionStartTime = sessionTimeouts[userId]?.startTime;
    //   if (sessionStartTime && Date.now() > sessionStartTime + 10 * 60 * 1000) {
    //     console.log("Session expired for user:", userId);
    //     return true;  // Session expired
    //   }
    //   return false;  // Session still valid
    // };
    

    // const startSessionTimeout = (userId) => {
    //   const sessionDuration = 10 * 60 * 1000;
    
    //   sessionTimeouts[userId] = {
    //     startTime: Date.now(),
    //     timeout: setTimeout(() => {
    //       io.to(users[userId]).emit("chatSessionExpired", { message: "Your chat session has expired." });
    //       io.sockets.sockets[users[userId]].disconnect(); // Disconnect the user after 10 minutes
    //     }, sessionDuration),
    //   };
    
    //   console.log(`Session started for user ${userId} at ${sessionTimeouts[userId].startTime}`);
    // };

    // Handle sending messages
    socket.on("sendMessage", async ({ to, message, mediaType, mediaUrl, mediaSize, from, timestamp }) => {
      const senderId = socket.userId;



      // if (checkSessionExpiry(senderId)) {
      //   return socket.emit("expiryError", { message: "Your chat session has expired." });
      // }





      console.log("Getting sender id=============>", senderId)
      console.log(`Sending message from ${senderId} to ${to}: ${message}`);

      const getUser = await UserRepository.findById(senderId);

      if (getUser && getUser.role_id === 3) {
        console.log("Active Users: =====================> ", users);
        console.log("Active Chat Sessions: =====================> ", activeSessions);

        // Active Users: =====================>  {
        //   '5': 'Ujh0W1yJfjir3kzeAAAJ',
        //   '37': '0AU7OXXEYP6-BXSmAAAP',
        //   '44': 'xIqkEJlZ4zr7v85zAAAL'
        // }
        // Active Chat Sessions: =====================>  { '37': Set(1) { 5 }, '44': Set(1) { 5 } }

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



    
    // **Handle Video Call Initiation**
    socket.on("initiateCall", async ({ callerId, receiverId, channelName }) => {
      console.log("Call initiated ===>", callerId, receiverId, channelName)
      // const callerId = socket.userId;
      if (!users[receiverId]) {
        return socket.emit("callError", { message: "User is offline!" });
      }

      console.log(`User ${callerId} is calling ${receiverId}`);

      io.to(users[receiverId]).emit("incomingCall", { from: callerId, channelName });
    });

    // **Handle Call Acceptance**
    socket.on("acceptCall", async ({ from, to, channelName }) => {  // from :caller, to : receiver
      console.log("Call accepted===>", from, to, channelName)
      // const recipientId = socket.userId;

      console.log(`User ${from} accepted the call from ${to}`);

      // Generate Agora Token
      // const channelName = `video_${from}_${recipientId}`;
      // const agoraToken = generateRtcToken(channelName);

      // Save the token in DB (optional)
      // await create({ channelName, token: agoraToken });

      // Send the Agora token and channel name to both users
      io.to(users[from]).emit("callAccepted", { channelName });
      io.to(users[to]).emit("callAccepted", { channelName });
    });

    // **Handle Call Rejection**
    socket.on("rejectCall", ({ from, to }) => {  
      console.log(`User ${from} rejected the call from ${to}`);
      io.to(users[to]).emit("callRejected", { message: "Call rejected!" });
    });


    // End Call
    socket.on("endCall", ({from, to})=>{
      console.log(`User ${from} ended the call from ${to}`);
      io.to(users[to]).emit("callEnded", { message: "Call ended!" });
    })

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


        // if (sessionTimeouts[disconnectedUserId]) {
        //   clearTimeout(sessionTimeouts[disconnectedUserId].timeout);
        //   delete sessionTimeouts[disconnectedUserId]; // Remove the session timeout reference
        //   console.log(`Session timeout cleared for user ${disconnectedUserId}`);
        // }


        delete users[disconnectedUserId];
        console.log(`User ${disconnectedUserId} logged out.`);

        // Only reduce chat count if user had an active session
        if (activeSessions[disconnectedUserId] && activeSessions[disconnectedUserId].size > 0) {
          console.log(`Ending chat session for ${disconnectedUserId}`);
          activeSessions[disconnectedUserId].clear();
          delete activeSessions[disconnectedUserId];

          const subscription = await SubscriptionRepository.getByUser(disconnectedUserId);
          console.log("subscription data===========", subscription)
          if (subscription && subscription.plan_type === "basic") {
            await SubscriptionRepository.update(subscription.id, {
              coins: subscription.coins === 0 ? 0 : subscription.coins - 1,
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






// const jwt = require("jsonwebtoken");
// const { createChat } = require("../repositories/MessageRepository");
// const { checkChatAndVideoCallCount } = require("../utils/checkChatAndVideoCallCount");
// const SubscriptionRepository = require("../repositories/SubscriptionRepository");
// const UserRepository = require("../repositories/UserRepository");
// const { update, create } = require("../repositories/RtcTokenRepository"); // To store Agora tokens
// const generateAgoraToken = require("../utils/agoraTokenGenerator"); // Utility to generate Agora token

// const JWT_SECRET = process.env.JWT_SECRET;
// const users = {}; // Stores online users (userId -> socketId)
// const activeSessions = {}; // Stores active chat sessions (userId -> Set of modelIds)

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // **Authenticate User**
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

//     // **Handle Sending Messages**
//     socket.on("sendMessage", async ({ to, message, mediaType, mediaUrl, mediaSize, from, timestamp }) => {
//       const senderId = socket.userId;
//       console.log(`Sending message from ${senderId} to ${to}: ${message}`);

//       if (!users[to]) {
//         await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message });
//         console.log(`User ${to} is offline.`);
//         return;
//       }

//       try {
//         await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message });

//         io.to(users[to]).emit("receiveMessage", {
//           from: senderId,
//           message,
//           to: to,
//           timestamp,
//           mediaUrl,
//           mediaSize,
//           mediaType,
//         });

//         console.log(`Message sent to ${to}: ${message}`);
//       } catch (error) {
//         console.error("Error saving message:", error);
//       }
//     });

//     // **Handle Video Call Initiation**
//     socket.on("initiateCall", async ({ to }) => {
//       const callerId = socket.userId;
//       if (!users[to]) {
//         return socket.emit("callError", { message: "User is offline!" });
//       }

//       console.log(`User ${callerId} is calling ${to}`);

//       io.to(users[to]).emit("incomingCall", { from: callerId });
//     });

//     // **Handle Call Acceptance**
//     socket.on("acceptCall", async ({ from }) => {
//       const recipientId = socket.userId;

//       console.log(`User ${recipientId} accepted the call from ${from}`);

//       // Generate Agora Token
//       const channelName = `video_${from}_${recipientId}`;
//       const agoraToken = generateAgoraToken(channelName);

//       // Save the token in DB (optional)
//       await create({ channelName, token: agoraToken });

//       // Send the Agora token and channel name to both users
//       io.to(users[from]).emit("callAccepted", { channelName, agoraToken });
//       io.to(users[recipientId]).emit("callAccepted", { channelName, agoraToken });
//     });

//     // **Handle Call Rejection**
//     socket.on("rejectCall", ({ from }) => {
//       console.log(`User ${socket.userId} rejected the call from ${from}`);
//       io.to(users[from]).emit("callRejected", { message: "Call rejected!" });
//     });

//     // **Handle User Disconnection**
//     socket.on("disconnect", async () => {
//       console.log("User disconnected:", socket.id);
//       let disconnectedUserId = null;

//       for (let userId in users) {
//         if (users[userId] === socket.id) {
//           disconnectedUserId = userId;
//           break;
//         }
//       }

//       if (disconnectedUserId) {
//         delete users[disconnectedUserId];
//         console.log(`User ${disconnectedUserId} logged out.`);
//       }
//     });
//   });
// };

// module.exports = socketHandler;
