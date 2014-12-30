'use strict';
var euristicFunc = require('./euristics'); // helper function
var generateStateTree = require('./generatetree');

function miniMax(gameState, cellValue, maximizingPlayer) {
    var childStates = gameState.getChildren();
    var bestValue;
    var currentValue;

    if (childStates.length === 0) {
        var stateAssessment = euristicFunc(gameState.getBoardState(), cellValue);
        gameState.assessment = stateAssessment;
        return stateAssessment;
    }

    if (maximizingPlayer) {
        bestValue = Number.NEGATIVE_INFINITY;

        for (var i = 0; i < childStates.length; i++) {
            currentValue = miniMax(childStates[i], cellValue, false);
            bestValue = Math.max(bestValue, currentValue);
        };
        gameState.assessment = bestValue;

        return bestValue;
    }
    else {
        bestValue = Number.POSITIVE_INFINITY;

        for (var i = 0; i < childStates.length; i++) {
            currentValue = miniMax(childStates[i], cellValue, true);
            bestValue = Math.min(bestValue, currentValue);
        };
        gameState.assessment = bestValue;

        return bestValue;
    }
}

module.exports = {
    generateNextMove: function (board, cellValue) {
        var currentMoveCell = cellValue;
        var nextMoveCell;
        if(currentMoveCell === 1) {
            nextMoveCell = 2;
        }
        else {
            nextMoveCell = 1;
        }
        var stateTree = generateStateTree(board, currentMoveCell, nextMoveCell);
        var bestMove = miniMax(stateTree, cellValue, true);
        var nextMoveStates = stateTree.getChildren();
        for (var i = 0; i < nextMoveStates.length; i++) {
            if(nextMoveStates[i].assessment === bestMove) {
                return nextMoveStates[i].move;
            }
        };
    }
};
