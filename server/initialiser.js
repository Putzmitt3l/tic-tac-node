var initialiser = (function() {
    'use strict';
    var uuid = require('node-uuid');

    var Game = require('./game');
    var Player = require('./player');

    var socketEvents = {
        listen: {
            socketConnection: 'connection',
            socketDisconnect: 'disconnect',
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
        _socketsDictionary: {},
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

    /**
     * Subscribes a socket for gameStart and makeTurn events emitted from
     * the client currently connected to server
     * @param  {uuidString} socketId
     */
    function monitorSocket (socketId) {
        var socket = initialiserModule._getSocketById(socketId);
        if(!!socket) {
            socket.on(socketEvents.listen.startGame, statGameHandler);
            socket.on(socketEvents.listen.cellFilled, turnHandler);

            // Case when player drops out of a game
            // TODO: check 'disconnect' firing issue
            // socket.on(socketEvents.listen.socketDisconnect, function () {
            //     var player = Player.getInstanceFromDictionary(socket.socketId);
            //     player.emit('quit');
            // });
        }
    }

    /**
     * Handles the 'GameStart' event emitted from the client.
     * Depending on the given parameters client might play singlePlayer with a bot,
     * or multiplayer in which case a new Game is created or player joins an existing game
     * @param  {Object} gameSettings
     */
    function statGameHandler (gameSettings) {
        if(gameSettings.multiplayer) {
            if(!gameSettings.gameId) {
                connectFirstPlayer(gameSettings);
            }
            else {
                var game = Game.getInstanceFromDictionary(gameSettings.gameId);
                if(!!game && !game.isReadyToStart()) {
                    connectSecondPlayer(gameSettings);
                }
                else {
                    // TODO: add a handler to kick third player
                }
            }
        }
        else {
            connectPlayerWithBot(gameSettings);
        }
    }

    /**
     * Creates a new game on first player connection.
     * Attaches socket delegation hanler to player and game start/end handlers to game
     * Emits to the client that he can invite a friend and joins the client's socket to
     * a room with the same Id as the created game
     * @param  {Object} gameSettings
     */
    function connectFirstPlayer (gameSettings) {
        var socketId = gameSettings.playerId;
        var socket = initialiserModule._getSocketById(socketId);

        var gameId = uuid();
        var game = new Game(gameId);
        var playerOne = new Player(socket.socketId, 'x', game);
        attachSocketDelegationToPlayer(playerOne, socket);

        game.addPlayer(playerOne);

        attachGameStartEndHandlers(game);

        socket.emit(socketEvents.emit.inviteopponent, {
            gameId: gameId
        });

        socket.join(gameId);
    }

    /**
     * Player joins an existing game by a given gameId from the gameSettings object.
     * Attaches the socket to the player class and joins the room.
     * @param  {Object} gameSettings
     */
    function connectSecondPlayer (gameSettings) {
        var socketId = gameSettings.playerId;
        var socket = initialiserModule._getSocketById(socketId);

        var game = Game.getInstanceFromDictionary(gameSettings.gameId);
        var playerTwo = new Player(socket.socketId, 'o', game);
        attachSocketDelegationToPlayer(playerTwo, socket);

        socket.join(gameSettings.gameId);

        // Note: player's socket must be added to socket room before
        // player enters the game
        game.addPlayer(playerTwo);
    }

    /**
     * Instantiates a new Game on client connection and creates an AI witch
     * which the player can interract in the game. Similar initialisations
     * are made like in 'connectFirstPlayer' function.
     * @param  {Object} gameSettings
     */
    function connectPlayerWithBot (gameSettings) {
        var socketId = gameSettings.playerId;
        var socket = initialiserModule._getSocketById(socketId);

        var gameId = uuid();
        var game = new Game(gameId);
        attachGameStartEndHandlers(game);

        var playerOne = new Player(socket.socketId, 'x', game);
        attachSocketDelegationToPlayer(playerOne, socket);

        var playerTwoId = uuid();
        var playerTwo = new Player(playerTwoId, 'o', game, true); // use a AI to be a player

        socket.join(gameId);

        // Note: player's socket must be added to socket room before
        // player enters the game
        game.addPlayer(playerOne);
        game.addPlayer(playerTwo);
    }

    /**
     * Handles the clients turn and delegates it to the assigned-to-the-socket Player
     * object, which updates the game state
     * @param  {Object} plyInfo      players' turn information
     */
    function turnHandler (plyInfo) {
        var player = Player.getInstanceFromDictionary(plyInfo.playerId);
        player.emit('updatestate', plyInfo.cellInfo);
    }

    //////////////////////////////////////////////////////////////////////////////////
    // Helper functions for attaching the event handlers to player and game objects //
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Attaches socket emitting to a particular player object.
     * @param  {Player} player
     * @param  {Socket} socket
     */
    function attachSocketDelegationToPlayer (player, socket) {
        player.on('sendthroughsocket', function (dataToSend) {
            // console.log('sent via socket');
            socket.emit(socketEvents.emit.opponentCell, dataToSend);
        });
    }

    /**
     * Attaches client's socket notifications for game start/end.
     * Messages are emitted to all sockets in a particular room, whether the game
     * is in singlePlayer mode or multiplayer.
     * @param  {Game} game
     */
    function attachGameStartEndHandlers (game) {
        game.on('gamestart', function () {
            initialiserModule._socketIoModule.sockets.in(game.getId()).emit(socketEvents.emit.gameStarted, {
                gameId: game.getId(),
                playerOne: game.getPlayerOneId(),
                playerTwo: game.getPlayerTwoId()
            });
        });

        game.on('gameover', function (gameOverInfo) {
            initialiserModule._socketIoModule.sockets.in(game.getId()).emit(socketEvents.emit.gameEnd, {
                winner: gameOverInfo.winner
            });

            Player.removeInstanceFromDictionary(game.getPlayerOneId);
            Player.removeInstanceFromDictionary(game.getPlayerTwoId);
            Game.removeInstanceFromDictionary(gameOverInfo.game.getId());
        });
    }

    return initialiserModule;

}());

module.exports = initialiser;
