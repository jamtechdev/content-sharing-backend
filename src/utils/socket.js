// App.js
// ==============


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:8000';
const socket = io(API_URL);

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Retrieve token from localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      socket.emit('authenticate', storedToken);
    }

    socket.on('receiveMessage', (data) => {
      console.log('Received message:', data);
      setMessages((prev) => [...prev, `User ${data.from}: ${data.message}`]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      const { token, userId } = res.data;

      localStorage.setItem('authToken', token);
      setUserId(userId);
      setToken(token);
      socket.emit('authenticate', token);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleSendMessage = () => {
    if (!recipient || !message) {
      alert('Enter recipient and message');
      return;
    }

    socket.emit('sendMessage', { to: recipient, message });
    setMessages((prev) => [...prev, `You to ${recipient}: ${message}`]);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat App</h2>

      {!token ? (
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h3>Logged in as User {userId}</h3>
          <input type="text" placeholder="Recipient ID" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      <h3>Chat History</h3>
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
    </div>
  );
};

export default App;




// index.js (backend)
// ======================


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const db = require('./models/index');
const { User, Message } = db;

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // React app origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const users = {}; // Map userId to socket ID

// JWT Secret Key
const JWT_SECRET = 'secret';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(401).json({ message: 'User not found' });

  const isMatch = password === user.password;
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, userId: user.id });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Authenticate user using token
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      users[decoded.userId] = socket.id; // Map user ID to socket ID
      socket.userId = decoded.userId; // Attach userId to socket instance
      console.log(`User registered: ${decoded.userId}`);
      console.log('Current users:', users);
    } catch (error) {
      console.log('Authentication error:', error);
      socket.disconnect();
    }
  });

  // Send Message
  socket.on('sendMessage', async ({ to, message }) => {
    const senderId = socket.userId; // Get sender's user ID
    if (!users[to]) {
      console.log(`User ${to} is offline.`);
      return;
    }

    try {
      // Store message in DB
      await Message.create({ message, senderId, receiverId: to });

      // Emit message to recipient
      io.to(users[to]).emit('receiveMessage', { from: senderId, message });
      console.log(`Message sent to ${to}: ${message}`);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} logged out.`);
        break;
      }
    }
  });
});

server.listen(8000, () => console.log('Server running on port 8000'));

