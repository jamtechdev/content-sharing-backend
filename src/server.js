const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const routes = require("./router/routes");
const errorHandler = require("./middleware/ErrorHandler");
const {cronJob} = require('./controllers/SubscriptionController/SubscriptionController')

cronJob()
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());


app.use("/api", routes); 

app.use(errorHandler);

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
