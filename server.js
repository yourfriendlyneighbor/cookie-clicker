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
let upgrade_2_price = 12;
let upgrade_2_amount = 0;
let cpc = 1;
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

  /* USERNAME STUFF */
    socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
      io.emit('get username', socket.username || "Guest");
    });

    function updateUsernames(){
      io.emit('get users', users);
    }

  /* CLICKS */
  socket.on('plus click', function(data){
    clicks = clicks + data;
    sendClicks()
  });
  /* GETTING THINGS */
  socket.on('get username',function(){
    io.emit('recieve username', socket.username || "Guest")
  });
  socket.on('get username 4 click',function(){
    io.emit('get username 4 click', socket.username || "Guest")
  });
  function sendClicks(){
    io.emit('get clicks', clicks);
  }
  socket.on('remove cookies', function(data){
    clicks = clicks - data;
    io.emit('get cookies', clicks);
  });
  /* Increasing & Decreasing things */
  socket.on('upgrade 1 price', function(data){
    upgrade_1_price = data;
    io.emit('get upgrade 1 price', upgrade_1_price)
  });
  socket.on('upgrade 1 amount', function(data){
    upgrade_1_amount = data;
    io.emit('get upgrade 1 amount', upgrade_1_amount)
  });


  socket.on('upgrade 2 price', function(data){
    upgrade_2_price = data;
    io.emit('get upgrade 2 price', upgrade_2_price)
  });
  socket.on('upgrade 2 amount', function(data){
    upgrade_2_amount = data;
    io.emit('get upgrade 2 amount', upgrade_2_amount)
  });
  socket.on('cpc', function(data){
    cpc = data;
    io.emit('get cpc', cpc)
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
    io.emit('get upgrade 2 price', upgrade_2_price);
    io.emit('get upgrade 2 amount', upgrade_2_amount);
    io.emit('get cps', cps);
    io.emit('get cpc', cpc)
  }
  startUp()
  //Chat
    function updateUsernames(){
      io.emit('get users', users);
    }
    //Send Message
    socket.on('send message', function(data){
      messages.push(data)
      var randomGuest = Math.floor(Math.random() * (10000 - 1) + 1);
      io.emit('new message', {msg: data, user: socket.username || "Guest "})
    })
})
