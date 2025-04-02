// utils/sessionManager.js
const ChatSessionRepository = require('../repositories/ChatSessionRepository');

class SessionManager {
  constructor() {
    this.activeSessions = {}; // { sessionId: { modelId, userId, timer } }
    this.userToSessionMap = {}; // { userId: sessionId }
    this.SESSION_DURATION = 10 * 60 * 1000; // 10 minutes
  }

  async startSession(modelId, userId, io) {
    // Check if either user already has an active session
    if (this.userToSessionMap[modelId] || this.userToSessionMap[userId]) {
      throw new Error('User already in an active session');
    }
  
    const session = await ChatSessionRepository.create({
      modelId,
      userId,
      status: 'active'
    });
  
    const sessionId = session.id;
  
    this.activeSessions[sessionId] = {
      modelId,
      userId,
      timer: setTimeout(() => this.endSession(sessionId, io, 'timeout'), this.SESSION_DURATION)
    };
  
    this.userToSessionMap[modelId] = sessionId;
    this.userToSessionMap[userId] = sessionId;
  
    // Notify both users
    if (users[modelId]) {
      io.to(users[modelId]).emit('sessionStarted', { sessionId });
    }
    if (users[userId]) {
      io.to(users[userId]).emit('sessionStarted', { sessionId });
    }
  
    return sessionId;
  }

  async endSession(sessionId, io, reason) {
    const session = this.activeSessions[sessionId];
    if (!session) return;

    // Clear timeout
    clearTimeout(session.timer);

    // Update DB
    await ChatSessionRepository.update(sessionId, {
      status: reason === 'timeout' ? 'timeout' : 'ended',
      endTime: new Date()
    });

    // Clean up
    delete this.userToSessionMap[session.modelId];
    delete this.userToSessionMap[session.userId];
    delete this.activeSessions[sessionId];

    // Notify both users
    io.to(users[session.modelId]).emit('sessionEnded', { 
      sessionId, 
      reason: reason === 'timeout' ? 'Session expired' : 'Session ended' 
    });
    io.to(users[session.userId]).emit('sessionEnded', { 
      sessionId, 
      reason: reason === 'timeout' ? 'Session expired' : 'Session ended' 
    });
  }

  resetSessionTimer(sessionId, io) {
    const session = this.activeSessions[sessionId];
    if (session) {
      clearTimeout(session.timer);
      session.timer = setTimeout(
        () => this.endSession(sessionId, io, 'timeout'), 
        this.SESSION_DURATION
      );
    }
  }

  getSessionByUser(userId) {
    const sessionId = this.userToSessionMap[userId];
    return sessionId ? this.activeSessions[sessionId] : null;
  }
}

module.exports = new SessionManager();








// const ChatSessionRepository = require('../repositories/ChatSessionRepository')


// const startNewSession = async function(modelId, userId, io) {
//     try {
//       // Create session in database
//       const session = await ChatSessionRepository.create({
//         modelId,
//         userId,
//         startTime: new Date(),
//         status: 'active'
//       });
  
//       const sessionId = session.id;
  
//       // Track session locally
//       activeSessions[sessionId] = {
//         modelId,
//         userId,
//         startTime: new Date(),
//         timer: setTimeout(() => endSession(sessionId, io, "Session timed out"), SESSION_DURATION)
//       };
  
//       userSessions[modelId] = sessionId;
//       userSessions[userId] = sessionId;
  
//       // Notify both parties
//       if (users[modelId]) {
//         io.to(users[modelId]).emit("sessionStarted", { sessionId });
//       }
//       if (users[userId]) {
//         io.to(users[userId]).emit("sessionStarted", { sessionId });
//       }
  
//       console.log(`New session started between model ${modelId} and user ${userId}`);
  
//       return sessionId;
//     } catch (error) {
//       console.error("Error starting session:", error);
//       throw error;
//     }
//   }
  
//   // Helper function to end a session
//   const endSession = async function(sessionId, io, reason) {
//     if (!activeSessions[sessionId]) return;
  
//     const { modelId, userId, timer } = activeSessions[sessionId];
  
//     // Clear the timeout
//     clearTimeout(timer);
  
//     // Update database
//     await ChatSessionRepository.update(sessionId, {
//       status: 'ended',
//       endTime: new Date()
//     });
  
//     // Clean up local tracking
//     delete activeSessions[sessionId];
//     delete userSessions[modelId];
//     delete userSessions[userId];
  
//     // Notify both parties
//     if (users[modelId]) {
//       io.to(users[modelId]).emit("sessionEnded", { sessionId, reason });
//     }
//     if (users[userId]) {
//       io.to(users[userId]).emit("sessionEnded", { sessionId, reason });
//     }
  
//     console.log(`Session ${sessionId} ended: ${reason}`);
//   }
  
//   // Helper function to reset session timer
//   const resetSessionTimer = function (sessionId) {
//     if (activeSessions[sessionId]) {
//       clearTimeout(activeSessions[sessionId].timer);
//       activeSessions[sessionId].timer = setTimeout(
//         () => endSession(sessionId, io, "Session timed out"),
//         SESSION_DURATION
//       );
//       console.log(`Session ${sessionId} timer reset`);
//     }
//   }

//   module.exports = {startNewSession, endSession, resetSessionTimer}
  