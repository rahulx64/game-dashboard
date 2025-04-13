const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// In-memory leaderboard array
let leaderboard = [];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Send current leaderboard to new client
  socket.emit("leaderboard", leaderboard);

  socket.on("submitScore", ({ name, score }) => {
    console.log("Received Score - Name:", name, "Score:", score);

    // Update leaderboard
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Descending order

    // Limit to top 10 (optional)
    leaderboard = leaderboard.slice(0, 10);

    // Broadcast updated leaderboard to all clients
    io.emit("leaderboard", leaderboard);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});
