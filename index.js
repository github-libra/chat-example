var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var chatio = io.of('/chat');
var rooms = [];

chatio.on('connection', function(socket){

	socket.on('subscribe', function(data) {
		console.log( 'subscribe' );
		if(data.old) {
			socket.leave(data.old)
		}
		socket.room = data.room;
		
		socket.join(data.room);
		socket.emit('update-room', data.room);
	})
  	socket.on('disconnect', function() {
  		console.log( 'user leave' );
  	});

  	setInterval(function() {
  		chatio.in('chatroom1').emit('msg', 'hello chatroom1')
  	}, 2000);

  	setInterval(function() {
  		chatio.in('chatroom2').emit('msg', 'hello chatroom2')
  	}, 2000);
  	

});


