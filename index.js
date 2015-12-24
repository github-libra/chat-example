var app = require('express')();
var bodyParser = require('body-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function() {
    console.log('listening on *:3000');
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var chatio = io.of('/ilab');
var rooms = [];

chatio.on('connection', function(socket) {
    // console.log(socket.id);

    socket.on('subscribe', function(data) {
        console.log('subscribe to room %s', data.toRoom);

        if (rooms.indexOf(data.toRoom) === -1) {
            rooms.push(data.toRoom);
        }
        socket.join(data.toRoom);
    });

    socket.on('unsubscribe', function(data) {
        console.log('unsubscribe from room %s', data.fromRoom);

        socket.leave(data.fromRoom);
    })



    socket.on('delete', function(data) {
        socket.broadcast.to('env101').emit('update', data)
    })

});
app.put('/env', function(req, res) {
    console.log(req.body);
    chatio.to('env101').emit('update', req.body);
    res.sendStatus(200)
})
