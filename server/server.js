var express = require('express');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var initialiser = require('./initialiser');

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

initialiser.init(io);
