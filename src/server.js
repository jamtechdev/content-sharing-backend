const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const http = require("http");
const socketIo = require("socket.io");
const routes = require("./router/routes");
const errorHandler = require("./middleware/ErrorHandler");
const socketHandler = require('./utils/socket')
const { cronJob } = require("./utils/cronJob");

dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    },
});
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/api", routes);
app.use(errorHandler);

app.get('/test', (req, res)=>{
    res.json("Hello")
})

socketHandler(io)
// cronJob();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));