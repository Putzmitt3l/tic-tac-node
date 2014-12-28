var express = require('express');
var path = require('path');
var uuid = require('node-uuid');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var paths = {
    pagePath: path.normalize(__dirname + '/../static/index.html'),
    resourcePath: path.normalize(__dirname + '/../static/')
};

app.use(express.static(paths.resourcePath));

app.get('/', function(req, res){
    res.sendFile(paths.pagePath);
});

http.listen(3000, function(){
    console.log('listening on 3000');
});

io.on('connection', function(socket) {
    socket.socketId = uuid();
    console.log('a user connected: ' + socket.socketId);

    io.emit('newplayer', { playerId: socket.socketId });

    // socket.on('disconnect', function() {
    //     console.log('user disconnected');
    // });

    socket.on('cellfilled', function(cellInfo) {
        // console.log('message: ' + cellInfo);
        // io.emit('chat message', cellInfo);
        console.log('['+ cellInfo.cellRow + ',' + cellInfo.cellCol + ']');
        // AI logic
        io.emit('opponentcellfilled');
    });
});
