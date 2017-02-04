const express= require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = [];
connections = [];
let clicks = 0;
let upgrade_1_price = 25;
let upgrade_1_amount = 0;

const port = process.env.PORT || 3001;
server.listen(port);
console.log("Server running...");

app.use(express.static('client'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);

  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames()
    connections.splice(connections.indexOf(socket), 1);
  });

  //New User
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames()
  });

  function updateUsernames(){
    io.emit('get users', users);
  }

  socket.on('plus click', function(data){
    clicks = clicks + data;
    sendClicks()
  });

  function sendClicks(){
    io.emit('get clicks', clicks);
    io.emit('get userClicked', socket.username)
  }

  socket.on('remove cookies', function(data){
    clicks = clicks - data;
    io.emit('get cookies', clicks);
  });
  socket.on('upgrade 1 price', function(data){
    upgrade_1_price = data;
    io.emit('get upgrade 1 price', upgrade_1_price)
  })
  socket.on('upgrade 1 amount', function(data){
    upgrade_1_amount = data;
    io.emit('get upgrade 1 amount', upgrade_1_amount)
  })
  function startUp(){
    sendClicks();
    io.emit('get cookies', clicks);
    io.emit('get upgrade 1 price', upgrade_1_price);
    io.emit('get upgrade 1 amount', upgrade_1_amount)
  }
  startUp()
})