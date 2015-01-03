var Ai = require('./ai');

function PlayerException (message) {
    this.name = 'PlayerException';
    this.message = message || 'Unhandled PlayerException occurred.';
}

function Player (id, turnValue, useBot) {
    this._id = id;
    this._ply = turnValue;
    this._bot = (useBot)? new Ai(id, turnValue) : null;
}

Player.prototype.getGameState = function (gameStateBoard) {
    if(!!this._bot) {
        // delegate cell dicision to bot
    }
    else {
        // send to socket with playerId
    }
    // return next cell
}

Player.prototype.getId = function () {
    return this._id;
}

Player.prototype.getPly = function () {
    return this._ply;
}

Player.prototype.isBot = function () {
    return !!this._bot;
}

module.exports = Player;
