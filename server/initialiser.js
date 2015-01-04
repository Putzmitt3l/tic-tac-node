var initialiser = (function() {
    'use strict';
    var uuid = require('node-uuid');

    var Game = require('./game');
    var Player = require('./player');

    var socketEvents = {
        listen: {
            socketConnection: 'connection',
            startGame: 'startgame',
            cellFilled: 'cellfilled'
        },
        emit: {
            gameStarted: 'gamestarted',
            gameEnd: 'gameover',
            playerconnected: 'playerconnected',
            inviteopponent: 'inviteopponent',
            opponentCell: 'opponentcellfilled'
        },
    };

    var initialiserModule = {
        this._socketsDictionary: {},
    };

    initialiserModule._addSocket = function (socketId, socketObj) {
        this._socketsDictionary[socketId] = socketObj;
    }

    initialiserModule._getSocketById = function (socketId) {
        return this._socketsDictionary[socketId];
    }

    initialiserModule._removeSocketById = function (socketId) {
        var obsoliteSocket = this._socketsDictionary[socketId];
        this._socketsDictionary[socketId] = undefined;
        return obsoliteSocket;
    }

    initialiserModule.init = function (socketIo) {
        this._socketIoModule = socketIo;
        this._socketIoModule.on(socketEvents.listen.socketConnection, mainSocketHandler);
    }

    /////////////////////////////////////////
    // Handlers and control flow functions //
    /////////////////////////////////////////

    function mainSocketHandler (socket) {
        var socketId = connectSocket(socket);
        monitorSocket(socketId);
    }

    function connectSocket (socket) {
        var socketId = uuid();

        socket.socketId = socketId;
        initialiserModule._addSocket(socketId, socket);

        //tell the client with which socket it's working with
        socket.emit(socketEvents.emit.playerconnected, { playerId: socketId });

        return socketId;
    }

    function monitorSocket (socketId) {
        var socket = initialiserModule._getSocketById(socketId);
        if(!!socket) {
            socket.on(socketEvents.listen.startGame, statGameHandler);
            socket.on(socketEvents.listen.cellFilled, turnHandler);
        }
    }

    function statGameHandler (gameSettings) {
        // TODO: add check if game is already full
        // Add handling if game is already full

        // either we've created a new game
        // or we are joining an existing one
        var gameId = null;
        var game = null;

        var playerOne = null;
        var playerTwo = null;

        var socketId = gameSettings.playerId;
        var socket = initialiserModule._getSocketById(socketId);

        if(gameSettings.multiplayer) {
            if(!gameSettings.gameId) {
                // first player connects
                gameId = uuid();
                game = new Game(gameId);
                playerOne = new Player(socket.socketId, 'x');
                game.addPlayer(playerOne);

                socket.emit(socketEvents.emit.inviteopponent, {
                    gameId: gameId
                });

                socket.join(gameId);
            }
            else {
                // second player connects
                game = Game.getInstanceFromDictionary(gameSettings.gameId);
                playerTwo = new Player(socket.socketId, 'o');
                game.addPlayer(playerTwo);

                socket.join(gameSettings.gameId);
            }
        }
        else {
            gameId = uuid();
            game = new Game(gameId);
            playerOne = new Player(socket.socketId, 'x');
            var playerTwoId = uuid();
            playerTwo = new Player(playerTwoId, 'o', true); // use a AI to be a player

            game.addPlayer(playerOne);
            game.addPlayer(playerTwo);

            socket.join(gameId);
        }

        if(game.isReadyToStart()) {
            // broadcast to opponents game has started
            // and who is playerOne and playerTwo
            io.sockets.in(game.getId()).emit(socketEvents.emit.gameStarted, {
                gameId: game.getId(),
                playerOne: game.getPlayerOneId(),
                playerTwo: game.getPlayerTwoId()
            });
        }
    }

    function turnHandler (plyInfo) {
        var socketId = plyInfo.playerId;
        var socket = initialiserModule._getSocketById(socketId);

        socket.on(socketEvents.listen.cellFilled, function(plyInfo) {
            // console.log('['+ cellInfo.cellRow + ',' + cellInfo.cellCol + ']');
            // AI logic
            socket.broadcast.emit(socketEvents.emit.opponentCell, {
                opponentCell: plyInfo.cellInfo
            });
        });
    }

    return initialiserModule;

}());

module.exports = initialiser;