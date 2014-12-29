function GameException (message) {
    this.name = 'GameException';
    this.message = message || 'Unhandled GameException occurred.';
};

function Game (id) {
    this._matrix = [[0,0,0],[0,0,0],[0,0,0]];
    this._ply = 'x';
    this._id = id;

    addInstanceToDictionary(this);
};

function addInstanceToDictionary (instance) {
    if(Game._instancesDictionary === undefined) {
        Game._instancesDictionary = {};
    }

    Game._instancesDictionary[instance._id] = instance;
};

Game.getInstanceFromDictionary = function (instanceId) {
    if(Game._instancesDictionary === undefined) {
        throw new GameException('No Game instances are created.');
    }

    var instance =  Game._instancesDictionary[instanceId];
    if(instance === undefined) {
        instance = null;
    }
    return instance;
};

Game.removeInstanceFromDictionary = function (instanceId) {
    if(Game._instancesDictionary === undefined) {
        throw new GameException('No Game instances are created.');
    }

    var removedInstance = Game._instancesDictionary[instanceId];

    Game._instancesDictionary[instanceId] = undefined;

    return removedInstance;
}

Game.prototype.updateState = function (ply, filledCell) {
    if(this._ply !== ply) {
        throw new GameException('Unauthorized player move');
    }
    var newCellValue = (this._ply === 'x')? 1 : 2;
    this._matrix[filledCell.cellRow][filledCell.cellCol] = newCellValue;

    if(this._ply === 'x') {
        this._ply = 'o';
    }
    else {
        this._ply === 'x';
    }
};

Game.prototype.getId = function () {
    return this._id;
};

Game.prototype.getPly = function () {
    return this._ply;
};

Game.prototype.getState = function () {
    return this._matrix;
};


module.exports = Game;

// TODO: add player uuids
