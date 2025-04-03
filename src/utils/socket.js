const jwt = require("jsonwebtoken");
const { createChat } = require("../repositories/MessageRepository");
const {
  checkChatAndVideoCallCoins,
  updateChatCoins,
} = require("../utils/checkChatAndVideoCallCoins");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const UserRepository = require("../repositories/UserRepository");
const { update, create } = require("../repositories/VideoCallRepository");
const { generateRtcToken } = require("../utils/generateRtcToken");
const ChatSessionRepository = require("../repositories/ChatSessionRepository");

const JWT_SECRET = process.env.JWT_SECRET;
const users = {}; // Stores online users (userId -> socketId)
const activeSessions = {}; // { sessionId: { modelId, userId, timer } }
const userToSessionMap = {}; // { userId: sessionId }

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("authenticate", async (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        users[decoded.userId] = socket.id; // { '5': 'fUShNQMhk8XsrI0SAAA3', '37': '7Ci_1uM25wLJSp0qAAA1' }

        socket.userId = decoded.userId;
        console.log(`User registered: ${decoded.userId}`);
        console.log("Current users:", users);
        io.emit("user-online", { userId: decoded.userId });



        // Checking coins here at the time of authentication -
        const plan = await SubscriptionRepository.getByUser(decoded.userId);
        if (decoded.role === "user" && plan.name === "basic") {
          const response = await checkChatAndVideoCallCoins(decoded.userId);
          if (response.error) {
            return socket.emit("chat_count_exceed", {
              message: response.error,
            });
          }
        }



      } catch (error) {
        console.log("Authentication error:", error);
        socket.emit("error", { message: "Authentication failed!" });
        socket.disconnect();
      }
    });

    socket.on(
      "sendMessage",
      async ({ to, message, mediaType, mediaUrl, mediaSize, from, timestamp, plan, role }) => {
        const senderId = socket.userId;
        console.log(`Sending message from ${senderId} to ${to}: ${message}`);
        if (
          role === "model" &&
          !userToSessionMap[senderId] &&
          !userToSessionMap[to]
        ) {
          if (users[to]) {
            const sessionData = {
              user_id: to,
              model_id: from,
            };
            const existingSession =
              await ChatSessionRepository.getActiveChatSession(from, to);
            if (!existingSession) {
              await ChatSessionRepository.create(sessionData);
            }
          }
        }
        // const getUser = await UserRepository.findById(senderId);
        // if (role === "user" && plan === "basic") {
        console.log("Active Users: ======> ", users);
        console.log("Active Chat Sessions: ======> ", activeSessions);

        // Store active session if not already stored
        if (!activeSessions[senderId]) {
          activeSessions[senderId] = new Set();
        }
        activeSessions[senderId].add(to);
        console.log("Checking for the active session at start", activeSessions)
        // Check chat coins
        // const response = await checkChatAndVideoCallCoins(getUser.id);     // Now using at the time of authentication
        // console.log(response, "response");
        // if (response.error) {
        //   return socket.emit("chat_count_exceed", {
        //     message: response.error,
        //   });
        // }
        // }

        // If recipient is offline
        if (!users[to]) {
          await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message, messageId: timestamp });
          console.log(`User ${to} is offline.`);
          return;
        }

        try {
          await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message, messageId: timestamp });

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

    socket.on("chat-session-expired", async ({ userId, modelId }) => {
      await updateChatCoins(userId);
      await ChatSessionRepository.updateByUser(userId, {
        status: "ended",
        last_activity: new Date(),
      });
    });

    // ---------------- VIDEO CALL EVENTS ------------------->
    socket.on("initiateCall", async ({ callerId, receiverId, channelName }) => {
      console.log("Call initiated ===>", callerId, receiverId, channelName);
      // const callerId = socket.userId;
      if (!users[receiverId]) {
        return socket.emit("callError", { message: "User is offline!" });
      }

      console.log(`User ${callerId} is calling ${receiverId}`);

      io.to(users[receiverId]).emit("incomingCall", {
        from: callerId,
        channelName,
      });
    });

    socket.on("acceptCall", async ({ from, to, channelName }) => {
      // from :caller, to : receiver
      console.log("Call accepted===>", from, to, channelName);
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

    socket.on("rejectCall", ({ from, to }) => {
      console.log(`User ${from} rejected the call from ${to}`);
      io.to(users[to]).emit("callRejected", { message: "Call rejected!" });
    });

    socket.on("endCall", ({ from, to }) => {
      console.log(`User ${from} ended the call from ${to}`);
      io.to(users[to]).emit("callEnded", { message: "Call ended!" });
    });

    // -------------------- VIDEO CALL EVENT ENDS HERE --------------------->

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      let disconnectedUserId = null;

      for (let userId in users) {
        if (users[userId] === socket.id) {
          disconnectedUserId = userId;
          io.emit("user-offline", { userId });
          break;
        }
      }

      if (disconnectedUserId) {
       try {
        await updateChatCoins(disconnectedUserId);
        await ChatSessionRepository.updateByUser(disconnectedUserId, {
          status: "ended",
          last_activity: new Date(),
        });
        await UserRepository.updateUserById(disconnectedUserId, { status: "offline" });
        delete users[disconnectedUserId];
        console.log(`User ${disconnectedUserId} logged out.`);

        // Only reduce chat count if user had an active session
        if (
          activeSessions[disconnectedUserId] &&
          activeSessions[disconnectedUserId].size > 0
        ) {
          console.log("Active sesesion for the disconnected user", activeSessions)
          console.log(`Ending chat session for ${disconnectedUserId}`);
          activeSessions[disconnectedUserId].clear();
          delete activeSessions[disconnectedUserId];
        }
       } catch (error) {
        console.error("Error updating DB on disconnect:", error);
       }
      }
    });
  });
};

module.exports = socketHandler;







// --------- Proper workiing code 29/03/2025 ----------------->

// module.exports = socketHandler;
// const jwt = require("jsonwebtoken");
// const { createChat } = require("../repositories/MessageRepository");
// const {
//   checkChatAndVideoCallCoins,
//   updateChatCoins,
// } = require("../utils/checkChatAndVideoCallCoins");
// const SubscriptionRepository = require("../repositories/SubscriptionRepository");
// const UserRepository = require("../repositories/UserRepository");
// const { update, create } = require("../repositories/VideoCallRepository");
// const { generateRtcToken } = require("../utils/generateRtcToken");
// const ChatSessionRepository = require("../repositories/ChatSessionRepository");

// const JWT_SECRET = process.env.JWT_SECRET;
// const users = {}; // Stores online users (userId -> socketId)
// const activeSessions = {}; // { sessionId: { modelId, userId, timer } }
// const userToSessionMap = {}; // { userId: sessionId }

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("authenticate", async (token) => {
//       try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         users[decoded.userId] = socket.id; // { '5': 'fUShNQMhk8XsrI0SAAA3', '37': '7Ci_1uM25wLJSp0qAAA1' }

//         socket.userId = decoded.userId;
//         console.log(`User registered: ${decoded.userId}`);
//         console.log("Current users:", users);
//         io.emit("user-online", { userId: decoded.userId });
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
//         plan,
//         role,
//       }) => {
//         const senderId = socket.userId;
//         console.log(`Sending message from ${senderId} to ${to}: ${message}`);
//         if (
//           role === "model" &&
//           !userToSessionMap[senderId] &&
//           !userToSessionMap[to]
//         ) {
//           if (users[to]) {
//             const sessionData = {
//               user_id: to,
//               model_id: from,
//             };
//             const existingSession =
//               await ChatSessionRepository.getActiveChatSession(from, to);
//             if (!existingSession) {
//               await ChatSessionRepository.create(sessionData);
//             }
//           }
//         }
//         const getUser = await UserRepository.findById(senderId);
//         if (role === "user" && plan === "basic") {
//           console.log("Active Users: ======> ", users);
//           console.log("Active Chat Sessions: ======> ", activeSessions);

//           // Store active session if not already stored
//           if (!activeSessions[senderId]) {
//             activeSessions[senderId] = new Set();
//           }
//           activeSessions[senderId].add(to);

//           // Check chat coins
//           const response = await checkChatAndVideoCallCoins(getUser.id);
//           console.log(response, "response");
//           if (response.error) {
//             return socket.emit("chat_count_exceed", {
//               message: response.error,
//             });
//           }
//         }

//         // If recipient is offline
//         if (!users[to]) {
//           await createChat({
//             senderId,
//             receiverId: to,
//             mediaUrl,
//             mediaSize,
//             mediaType,
//             message,
//             messageId: timestamp,
//           });
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
//             messageId: timestamp,
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

//     socket.on("chat-session-expired", async ({ userId, modelId }) => {
//       console.log("User data fields", userId, modelId);
//       await updateChatCoins(userId);
//       await ChatSessionRepository.updateByUser(userId, {
//         status: "ended",
//         last_activity: new Date(),
//       });
//     });

//     // ---------------- VIDEO CALL EVENTS ------------------->
//     socket.on("initiateCall", async ({ callerId, receiverId, channelName }) => {
//       console.log("Call initiated ===>", callerId, receiverId, channelName);
//       // const callerId = socket.userId;
//       if (!users[receiverId]) {
//         return socket.emit("callError", { message: "User is offline!" });
//       }

//       console.log(`User ${callerId} is calling ${receiverId}`);

//       io.to(users[receiverId]).emit("incomingCall", {
//         from: callerId,
//         channelName,
//       });
//     });

//     socket.on("acceptCall", async ({ from, to, channelName }) => {
//       // from :caller, to : receiver
//       console.log("Call accepted===>", from, to, channelName);
//       // const recipientId = socket.userId;

//       console.log(`User ${from} accepted the call from ${to}`);

//       // Generate Agora Token
//       // const channelName = `video_${from}_${recipientId}`;
//       // const agoraToken = generateRtcToken(channelName);

//       // Save the token in DB (optional)
//       // await create({ channelName, token: agoraToken });

//       // Send the Agora token and channel name to both users
//       io.to(users[from]).emit("callAccepted", { channelName });
//       io.to(users[to]).emit("callAccepted", { channelName });
//     });

//     socket.on("rejectCall", ({ from, to }) => {
//       console.log(`User ${from} rejected the call from ${to}`);
//       io.to(users[to]).emit("callRejected", { message: "Call rejected!" });
//     });

//     socket.on("endCall", ({ from, to }) => {
//       console.log(`User ${from} ended the call from ${to}`);
//       io.to(users[to]).emit("callEnded", { message: "Call ended!" });
//     });

//     // -------------------- VIDEO CALL EVENT ENDS HERE --------------------->

//     // Handle disconnection
//     socket.on("disconnect", async () => {
//       console.log("User disconnected:", socket.id);
//       let disconnectedUserId = null;

//       for (let userId in users) {
//         if (users[userId] === socket.id) {
//           disconnectedUserId = userId;
//           io.emit("user-offline", { userId });
//           await ChatSessionRepository.update(userId, {
//             status: "ended",
//             last_activity: new Date(),
//           });
//           await UserRepository.updateUserById(userId, { status: "offline" });
//           break;
//         }
//       }

//       if (disconnectedUserId) {
//         delete users[disconnectedUserId];
//         await ChatSessionRepository.update(disconnectedUserId, {
//           status: "ended",
//           last_activity: new Date(),
//         });
//         console.log(`User ${disconnectedUserId} logged out.`);

//         // Only reduce chat count if user had an active session
//         if (
//           activeSessions[disconnectedUserId] &&
//           activeSessions[disconnectedUserId].size > 0
//         ) {
//           console.log(`Ending chat session for ${disconnectedUserId}`);
//           activeSessions[disconnectedUserId].clear();
//           delete activeSessions[disconnectedUserId];

//           await updateChatCoins(disconnectedUserId);
//         }
//       }
//     });
//   });
// };

// module.exports = socketHandler;













// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Authenticate user (unchanged)
//     socket.on("authenticate", async (token) => {
//       try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         users[decoded.userId] = socket.id;
//         socket.userId = decoded.userId;
//         console.log(`User registered: ${decoded.userId}`);
//         io.emit("user-online", { userId: decoded.userId });
//       } catch (error) {
//         console.log("Authentication error:", error);
//         socket.emit("error", { message: "Authentication failed!" });
//         socket.disconnect();
//       }
//     });

//     // Handle sending messages
//     socket.on("sendMessage", async ({ to, message, mediaType, mediaUrl, mediaSize, from, timestamp, plan, role }) => {
//       const senderId = socket.userId;
//       if (!senderId) return socket.disconnect();
//       console.log("Sender Id ==============<", senderId)

//       console.log(`Sending message from ${senderId} to ${to}: ${message}`);

//       try {
//         const getUser = await UserRepository.findById(senderId);
//         // const isModel = getUser && getUser.role_id === 3;
//         console.log(to, message, mediaType, mediaUrl, mediaSize, from, timestamp, plan, role)
//         if ((role === "model" && !userToSessionMap[senderId] && !userToSessionMap[to])) {

//           if (users[to]) {
//             try {
//               console.log("========== Both are login ==========>", senderId, to)
//               const sessionData = {
//                 user_id: to,
//                 model_id: from,
//               }
//               const existingSession = await ChatSessionRepository.getActiveChatSession(from , to)
//               let session;
//               if(existingSession){
//                 socket.emit("error", {message: `Session already exists`})
//               }
//               else {
//                 session = await ChatSessionRepository.create(sessionData);
//               }

//               const sessionId = session.id;

//               // Track session locally
//               activeSessions[sessionId] = {
//                 modelId: senderId,
//                 userId: to,
//                 timer: setTimeout(() => endSession(sessionId, io, 'timeout'), SESSION_DURATION)
//               };

//               userToSessionMap[senderId] = sessionId;
//               userToSessionMap[to] = sessionId;

//               // Notify both parties
//               io.to(users[senderId]).emit("sessionStarted", { sessionId });
//               io.to(users[to]).emit("sessionStarted", { sessionId });

//               console.log(`New session started between model ${senderId} and user ${to}`);
//             } catch (err) {
//               console.log("Session start error:", err.message);
//             }
//           }
//         }

//         // If there's an active session, reset its timer
//         const sessionId = userToSessionMap[senderId] || userToSessionMap[to];
//         if (sessionId && activeSessions[sessionId]) {
//           clearTimeout(activeSessions[sessionId].timer);
//           activeSessions[sessionId].timer = setTimeout(
//             () => endSession(sessionId, io, 'timeout'),
//             SESSION_DURATION
//           );
//         }

//         // Rest of your existing message handling
//         if (role !== "model") {
//           const response = await checkChatAndVideoCallCoins(getUser.id);
//           if (response.error) {
//             return socket.emit("chat_count_exceed", { message: response.error });
//           }
//         }

//         await createChat({ senderId, receiverId: to, mediaUrl, mediaSize, mediaType, message });

//         if (!users[to]) {
//           console.log(`User ${to} is offline.`);
//           return;
//         }

//         io.to(users[to]).emit("receiveMessage", {
//           from: senderId,
//           message,
//           to,
//           timestamp,
//           mediaUrl,
//           mediaSize,
//           mediaType,
//           role
//         });

//       } catch (error) {
//         console.error("Error in sendMessage:", error);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     // Handle disconnection
//     socket.on("disconnect", async () => {
//       console.log("User disconnected:", socket.id);
//       const userId = socket.userId;
//       if (!userId) return;

//       // Clean up user tracking
//       if (users[userId]) {
//         delete users[userId];
//         io.emit("user-offline", { userId });
//         await UserRepository.updateUserById(userId, {status: "offline"});
//       }

//       // End any active session this user was in
//       const sessionId = userToSessionMap[userId];
//       if (sessionId) {
//         await endSession(sessionId, io, 'disconnect');
//       }

//       // Your existing subscription coin logic
//       const subscription = await SubscriptionRepository.getByUser(userId);
//       if (subscription && subscription.plan_type === "basic") {
//         await SubscriptionRepository.update(subscription.id, {
//           coins: subscription.coins === 0 ? 0 : subscription.coins - 1,
//         });
//       }
//     });

//     // ... (keep all your existing video call handlers unchanged)
//   });
// };

// // Helper function to end a session
// async function endSession(sessionId, io, reason) {
//   console.log("its time to end the session ===========>")
//   const session = activeSessions[sessionId];
//   console.log("Session logged=====", session)
//   if (!session) return;

//   // Clear timeout
//   clearTimeout(session.timer);

//   // Update database
//   await ChatSessionRepository.update(sessionId, {
//     status: reason === 'timeout' ? 'timeout' : 'ended',
//     end_time: new Date(),
//     duration: Math.floor((new Date() - new Date(session.start_time)) / 1000) // in seconds
//   });

//   // Clean up local tracking
//   delete userToSessionMap[session.modelId];
//   delete userToSessionMap[session.userId];
//   delete activeSessions[sessionId];

//   // Notify both parties
//   if (users[session.modelId]) {
//     io.to(users[session.modelId]).emit("sessionEnded", {
//       sessionId,
//       reason: reason === 'timeout' ? 'Session expired' : 'Session ended'
//     });
//   }
//   if (users[session.userId]) {
//     io.to(users[session.userId]).emit("sessionEnded", {
//       sessionId,
//       reason: reason === 'timeout' ? 'Session expired' : 'Session ended'
//     });
//   }

//   console.log(`Session ${sessionId} ended: ${reason}`);
// }

// module.exports = socketHandler;

// const jwt = require("jsonwebtoken");

// const { createChat } = require("../repositories/MessageRepository");
// const { checkChatAndVideoCallCoins } = require("../utils/checkChatAndVideoCallCoins");
// const SubscriptionRepository = require("../repositories/SubscriptionRepository");
// const UserRepository = require("../repositories/UserRepository");
// const {update, create} = require('../repositories/VideoCallRepository')
// const {generateRtcToken} = require('../utils/generateRtcToken')
// const SessionManager = require('../utils/chatSessionHandler')

// const JWT_SECRET = process.env.JWT_SECRET;
// const users = {}; // Stores online users (userId -> socketId)
// const activeSessions = {}; // Stores active chat sessions (userId -> Set of modelIds)
