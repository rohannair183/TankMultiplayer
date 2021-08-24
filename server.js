let express = require("express");
let app = express();
let server = app.listen(3000);
app.use(express.static("public"));
let socket = require("socket.io");
let io = socket(server, () => {});

let players = {};
let bullets = {};

setInterval(heartbeat, 20);

function heartbeat() {
    io.sockets.emit("heartbeat", players);
}

io.sockets.on("connection", (socket) => {
  heartbeat();
  console.log(`Connection: ${socket.id}`);
  socket.on("start", (data) => {
    players[data.id] = data;
    console.log(players);
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
    delete players[socket.id];
    delete bullets[socket.id];
  });
});
