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
  let upgrade_2_price = 12;
  let upgrade_2_amount = 0;
  let cpc = 1;
  let cps = 0;
  $("#upgrade_1_price").html(upgrade_1_price);
  $("#upgrade_2_price").html(upgrade_2_price);
  $("#cps").html(cps)
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
  });

  $($cookie).on( "click", function() {
    socket.emit('get username 4 click')
    socket.emit('plus click', cpc)
  });
  socket.on('get username 4 click',function(data){
    alertify.warning(data + ": has clicked the cookie!", 1.25);
  });
  socket.on('get clicks', function(data){
    cookies = data
    $cookies.html(data);
  });

  $($upgrade1).on('click', function(){
    if(cookies >= upgrade_1_price){
      cookies = cookies - upgrade_1_price;
      socket.emit('remove cookies', upgrade_1_price);
      upgrade_1_price = Math.floor(upgrade_1_price * 1.5)
      socket.emit('upgrade 1 price', upgrade_1_price);
      upgrade_1_amount++;
      socket.emit('upgrade 1 amount', upgrade_1_amount)
      cps++;
      socket.emit('cps', cps);
      socket.emit('get username');
      $("#amount_upgrade_1").html(upgrade_1_amount)
    }
  });
  $($upgrade2).on('click', function(){
    if(cookies >= upgrade_2_price){
      cookies = cookies - upgrade_2_price;
      socket.emit('remove cookies', upgrade_2_price);
      upgrade_2_price = Math.floor(upgrade_2_price * 1.2)
      socket.emit('upgrade 2 price', upgrade_2_price);
      upgrade_2_amount++;
      socket.emit('upgrade 2 amount',upgrade_2_amount);
      cpc++;
      socket.emit('cpc', cpc);
      socket.emit('get username');
      $("#amount_upgrade_2").html(upgrade_2_amount)
    }
  })


  socket.on('recieve username', function(data){
    alertify.success(data + ": has bought an item", 5);
  })
  socket.on('get cookies', function(data){
    $cookies.html(data);
  });
  socket.on('get upgrade 1 price', function(data){
    upgrade_1_price = data;
    $("#upgrade_1_price").html(data);
  });
  socket.on('get upgrade 1 amount', function(data){
    upgrade_1_amount = data;
    $("#amount_upgrade_1").html(upgrade_1_amount)
  });
  socket.on('get upgrade 2 price', function(data){
    upgrade_2_price = data;
    $("#upgrade_2_price").html(data);
  });
  socket.on('get upgrade 2 amount', function(data){
    upgrade_2_amount = data;
    $("#amount_upgrade_2").html(upgrade_2_amount)
  });
  socket.on('get cpc', function(data){
    cpc = data;
  });
  socket.on('get cps', function(data){
    cps = data;
    $("#cps").html(cps)
  });
    setInterval(function () {
      cookies = cookies + cps;
      socket.emit('plus click', cps)
      $cookies.html(cookies);
    }, 1000);

    /* Chat */
    $("#messageForm").submit(function(e){
      e.preventDefault();
      socket.emit('send message', $("#message").val());
      $("#message").val(" ");
    })
    socket.on('new message', function(data){
      $("#chat").append('<div class="well"><strong>'+data.user + ': </strong>'+data.msg+'</div>');
    });
    socket.on('get users', function(data){
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<li class="list-group-item">'+data[i]+'</li>'
      }
      $("#users").html(html)
    })

})
