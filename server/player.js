var Ai = require('./ai');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function PlayerException (message) {
    this.name = 'PlayerException';
    this.message = message || 'Unhandled PlayerException occurred.';
}

function Player (id, turnValue, game, useBot) {
    this._id = id;
    this._ply = turnValue;
    this._bot = null;

    addInstanceToDictionary(this);

    var _this = this;
    game.on('stateupdated', function (newStateData) {
        _this.makeMove.call(_this, newStateData);
    });

    if(useBot) {
        var cellValue = (turnValue === 'x')? 1 : 2;
        this._bot = new Ai(id, cellValue, this);
        this._bot.on('botmovemade', function (newMove) {
            _this.emit('updatestate', newMove.cellInfo);
        });
    }
}

util.inherits(Player, EventEmitter);

//////////////////////////////
// Static Player Functions  //
//////////////////////////////

function addInstanceToDictionary (instance) {
    if(Player._instancesDictionary === undefined) {
        Player._instancesDictionary = {};
    }

    Player._instancesDictionary[instance._id] = instance;
};

function removeInstanceFromDictionary (instance) {
    Player.removeInstanceFromDictionary(instance.getId());
};

Player.getInstanceFromDictionary = function (instanceId) {
    if(Player._instancesDictionary === undefined) {
        throw new PlayerException('No Player instances are created.');
    }

    var instance =  Player._instancesDictionary[instanceId];
    if(instance === undefined) {
        instance = null;
    }
    return instance;
};

Player.removeInstanceFromDictionary = function (instanceId) {
    if(Player._instancesDictionary === undefined) {
        throw new PlayerException('No Player instances are created.');
    }

    var removedInstance = Player._instancesDictionary[instanceId];

    Player._instancesDictionary[instanceId] = undefined;

    return removedInstance;
}

//////////////////////////////////
// EOF Static Player Functions  //
//////////////////////////////////

Player.prototype.makeMove = function (newGameState) {
    if(this.getPly() === newGameState.nextPly) {
        if(!!this._bot) {
            // Go Bot Go!
            this.emit('runbot', newGameState);
        }
        else {
            // delegate move update to socket
            this.emit('sendthroughsocket', {
                opponentCell: newGameState.previousFilledCell
            });
        }
    }
};

Player.prototype.getId = function () {
    return this._id;
};

Player.prototype.getPly = function () {
    return this._ply;
};

Player.prototype.isBot = function () {
    return !!this._bot;
};

module.exports = Player;
