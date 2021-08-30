let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
console.log(port)
console.log(__dirname)

let server = app.listen(port);
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  const root = require('path').join(__dirname, 'Public')
  app.use(express.static(root));
  app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})
}else{
  app.use(express.static("public"));
}
let socket = require("socket.io");
let io = socket(server, () => {});

let playerCount = 0;
let players = {};
let bullets = {};

setInterval(heartbeat, 20);

function heartbeat() {
    io.sockets.emit("heartbeat", players);
    io.sockets.emit('gameData', {playerCount: playerCount});
}

io.sockets.on("connection", (socket) => {
  heartbeat();
  console.log(`Connection: ${socket.id}`);
  socket.on("start", (data) => {
    players[data.id] = data;
    console.log(players);
    playerCount += 1;
    console.log(`player count: ${playerCount}`);
  });
  socket.on("move", (data) => {
    players[data.id] = data;
  });
  socket.on("fire", (data) => {
    io.sockets.emit("createBullet", data);
    // bullets[data.id] = data;
  });
  socket.on("healthdown", (data) => {
    players = data;
  });
  socket.on("bullet_hit_unfocused", (data) => {
    players[data.id] = data;
    io.to(data.id).emit('bullet_hit_unfocused', data);
    console.log(data.health)
  });
  socket.on("dead", (data) => {
    socket.disconnect();
    delete players[socket.id];
    delete bullets[socket.id];
  });
  socket.on("disconnect", () => {
    playerCount -= 1;
    delete players[socket.id];
    delete bullets[socket.id];
  });
});
