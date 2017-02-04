$(function(){
  const socket = io.connect();
  const $userFormArea = $("#userFormArea");
  const $messageArea = $("#messageArea");
  const $userForm = $("#userForm");
  const $username = $("#username");
  const $users = $("#users");
  const $usersOnline = $("#usersOnline");
  const $body = $("body");
  const $gameArea = $("#gameArea");
  const $cookie = $("#cookie");
  const $cookies = $("#cookies");
  const $upgrade1 = $("#upgrade1");
  const $upgrade2 = $("#upgrade2");
  const $upgrade3 = $("#upgrade3");
  let cookies = 0;
  let upgrade_1_price = 25
  let upgrade_1_amount = 0;
  $("#upgrade_1_price").html(upgrade_1_price)
  $usersOnline.hide();
  $gameArea.hide();
  $userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data){
      if(data){
        $userFormArea.hide();
        $usersOnline.show();
        $gameArea.show()
      }
    });
    $username.val(" ");
  })
  $($cookie).on( "click", function() {
    socket.emit('plus click', 1)
  });
  socket.on('get clicks', function(data){
    cookies = data
    $cookies.html(data);
  });
  socket.on('get userClicked', function(data){
    if(data){
      alertify.warning(data + ": has clicked the cookie!", 1.25);
      console.log(data);
    }
  });
  $($upgrade1).on('click', function(){
    if(cookies >= upgrade_1_price){
      cookies = cookies - upgrade_1_price;
      socket.emit('remove cookies', upgrade_1_price);
      upgrade_1_price = Math.floor(upgrade_1_price * 1.5)
      socket.emit('upgrade 1 price', upgrade_1_price);
      upgrade_1_amount++;
      socket.emit('upgrade 1 amount', upgrade_1_amount)
    }
  });
  socket.on('get cookies', function(data){
    $cookies.html(data);
    console.log(data);
  });
  socket.on('get upgrade 1 price', function(data){
    upgrade_1_price = data;
    $("#upgrade_1_price").html(data);
    console.log(data);
  });
  socket.on('get upgrade 1 amount', function(data){
    upgrade_1_amount = data;
    console.log(data);
  })
})
