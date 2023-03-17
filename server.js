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
const CONFIG = require('./config/config')

// connection to mongoDB
mongoose
  .connect(CONFIG.MONGODB_URL)
  .then(() => {
    console.log("Connection to mongoDB successfully");
    httpServer.listen(CONFIG.PORT, "localhost", () => {
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

// session middleware
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


// runs when client connects
io.on("connection", async (socket) => {

  // parse options.json
  const optionsJSON = fs.readFileSync(
    path.join(__dirname, "data", "options.json"),
    "utf-8"
  );
  const options = JSON.parse(optionsJSON);

  const welcome = "Hello, How may I help you?";
  let user;

  // sets up user session for chat application
  const session = socket.request.session;
  let userId = session.userId;
  if (!userId) {
    userId = uuidv4();
    session.userId = userId;
    session.save((error) => {
      if (error) {
        console.log(error);
      }
    });
    user = await User.create({ userId: userId });
    // console.log("New user, 🎯");
  } else {
    // console.log("Welcome back, 🍿");
    user = await User.findOne({ userId: userId });
  }

  socket.emit("welcome", welcome);
  
  // sends options
  socket.emit("options", options);


  // listen for chat message
  socket.on("chatMessage", async (chatMsg) => {
    await handleMessage(chatMsg, socket, userId);
  });
});
