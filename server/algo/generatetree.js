'use strict';
var StateNode = require('./state-node');

function generateStateTree (boardState, currentTurn, nextTurn, depth) {
    var root = new StateNode(boardState);
    generateStateTreeNodes(root, depth || 3, currentTurn, nextTurn);
    return root;
}

function generateStateTreeNodes (stateNode, depth, currentMoveCellValue, nextMoveCellValue) {
    if (depth > 0) {
        generateChildrenForStateNode(stateNode, currentMoveCellValue);

        var stateNodeChildren = stateNode.getChildren();
        for (var i = 0; i < stateNodeChildren.length; i++) {
            generateStateTreeNodes(stateNodeChildren[i], depth - 1, nextMoveCellValue, currentMoveCellValue);
        };
    }
}

function generateChildrenForStateNode (stateNode, cellValue) {
    var freeCells = getFreeCells(stateNode.getBoardState());
    var currentFreeCell;
    var boardCopy;

    for (var i = 0; i < freeCells.length; i++) {
        boardCopy = copyBoard(stateNode.getBoardState());
        currentFreeCell = freeCells[i];
        boardCopy[currentFreeCell.cellRow][currentFreeCell.cellCol] = cellValue;
        stateNode.addChild(new StateNode(boardCopy));
    };
}

function copyBoard (board) {
    return JSON.parse(JSON.stringify(board));
}

function getFreeCells (board) {
    var freeCells = [];
    var boardDimension = 3;
    for (var row = 0; row < boardDimension; row++) {
        for (var col = 0; col < boardDimension; col++) {
            if(board[row][col] === 0) {
                freeCells.push({
                    cellRow: row,
                    cellCol: col
                });
            }
        };
    };
    return freeCells;
}

module.exports = generateStateTree;
