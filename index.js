var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


var allClients = [];

io.on('connection', function(socket) {
	socket.on('register', function(nickname) {
		socket.nickname = nickname;
		allClients.push(socket);
		console.log( allClients.length );
		io.emit('online', allClients.length)
		socket.broadcast.emit('system message', socket.nickname + ' joined');
	})
    
    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', socket.nickname + ': ' +msg);
    });
    socket.on('disconnect', function(msg) {
    	socket.broadcast.emit('system message', socket.nickname + ' left');

    	var index;
    	for (var i = allClients.length - 1; i >= 0; i--) {
    		if(allClients[i].nickname === socket.nickname) {
    			index = i;
    		}
    	}
    	allClients.splice(index, 1)
    	io.emit('online', allClients.length)
    });
    socket.on('typing', function(msg) {
    	socket.broadcast.emit('typing');
    })
    socket.on('nottyping', function() {
    	socket.broadcast.emit('nottyping')
    })
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

