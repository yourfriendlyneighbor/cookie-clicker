const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = [];
connections = [];
messages = [];
let clicks = 0;
let upgrade_1_price = 25;
let upgrade_1_amount = 0;
let cps = 0;

const port = process.env.PORT || 3000;
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
    updateUsernames();
    io.emit('get username', socket.username);
  });

  function updateUsernames(){
    io.emit('get users', users);
  }

  socket.on('plus click', function(data){
    clicks = clicks + data;
    sendClicks()
  });
  socket.on('get username',function(){
    io.emit('recieve username', socket.username)
  });
  socket.on('get username 4 click',function(){
    io.emit('get username 4 click', socket.username)
  });
  function sendClicks(){
    io.emit('get clicks', clicks);
  }
  socket.on('remove cookies', function(data){
    clicks = clicks - data;
    io.emit('get cookies', clicks);
  });
  socket.on('upgrade 1 price', function(data){
    upgrade_1_price = data;
    io.emit('get upgrade 1 price', upgrade_1_price)
  });
  socket.on('upgrade 1 amount', function(data){
    upgrade_1_amount = data;
    io.emit('get upgrade 1 amount', upgrade_1_amount)
  });
  socket.on('cps', function(data){
    cps = data;
    io.emit('get cps', cps)
  });

  function startUp(){
    sendClicks();
    io.emit('get cookies', clicks);
    io.emit('get upgrade 1 price', upgrade_1_price);
    io.emit('get upgrade 1 amount', upgrade_1_amount);
    io.emit('get cps', cps)
  }
  startUp()
  //Chat
  function updateUsernames(){
    console.log(users)
    io.emit('get users', users);
  }
  //Send Message
  socket.on('send message', function(data){
    messages.push(data)
    console.log(messages);
    var randomGuest = Math.floor(Math.random() * (10000 - 1) + 1);
    io.emit('new message', {msg: data, user: socket.username || "Guest " + socket.username})
  })
})
