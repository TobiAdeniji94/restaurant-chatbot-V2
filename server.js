const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const path = require("path");
const app = require("./app");
const User = require("./models/userModel");
const handleMessage = require("./utils/function");
const CONFIG = require('./config/config');

// Connection to MongoDB
mongoose
  .connect(CONFIG.MONGODB_URL)
  .then(() => {
    console.log("Connection to mongoDB successfully");
    httpServer.listen(CONFIG.PORT, "0.0.0.0", () => {
      console.log("Server running...", CONFIG.PORT);
    });
  })
  .catch((error) => {
    console.log(error, "Connection to mongoDB failed");
  });

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Caching options data
let options = [];
const loadOptions = () => {
  try {
    const optionsJSON = fs.readFileSync(path.join(__dirname, "data", "options.json"), "utf-8");
    options = JSON.parse(optionsJSON);
  } catch (err) {
    console.error("Error reading options file:", err);
  }
};

loadOptions();

// Session middleware
const sessionMiddleware = session({
  secret: CONFIG.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 13149000000 },
  store: MongoStore.create({
    mongoUrl: CONFIG.MONGODB_URL,
    collectionName: "sessions",
  }),
});

app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// When a client connects
io.on("connection", async (socket) => {
  const welcome = "Hello, how may I help you?";
  let user;

  const session = socket.request.session;
  let userId = session.userId;

  if (!userId) {
    userId = uuidv4();
    session.userId = userId;
    await new Promise((resolve, reject) => {
      session.save((error) => {
        if (error) reject(error);
        resolve();
      });
    });
    user = await User.create({ userId: userId });
  } else {
    user = await User.findOne({ userId: userId });
  };

  socket.emit("welcome", welcome);
  
  if (!session.optionsShown) {
    socket.emit("options", options);
    session.optionsShown = true;
    await new Promise((resolve, reject) => {
      session.save((error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  // Listen for chat messages
  socket.on("chatMessage", async (chatMsg) => {
    try {
      await handleMessage(chatMsg, socket, userId);
    } catch (error) {
      console.error("Error handling chat message:", error);
      socket.emit("error", "Something went wrong, please try again.");
    };
  });
});
