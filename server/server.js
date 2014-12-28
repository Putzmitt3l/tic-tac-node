var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

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
    console.log('a user connected');

    // io.emit('new user',)

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        // console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});
