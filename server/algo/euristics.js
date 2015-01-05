var assessment = require('../assessment');

// Note: function needs a little more tweeking
function euristicFunc (board, cellValue) {
    var euristicValue = 0;
    var boardDimension = 3;
    for (var i = 0; i < boardDimension; i++) {
        euristicValue += assessment.checkRow(board, i, cellValue);
        euristicValue += assessment.checkCol(board, i, cellValue);
    };

    euristicValue += assessment.checkDiagonal(board, cellValue);
    euristicValue += assessment.checkReverseDiagonal(board, cellValue);

    return euristicValue;
};

/*
    TODO: add tests

    sample Board tests for the euristic function
    var board1 = [[1,0,0],[0,0,0],[0,0,0]]; // returns 3
    var board2 = [[1,0,0],[0,1,0],[0,0,0]]; // returns 7
    var board3 = [[1,0,0],[0,0,0],[0,0,2]]; // returns 0
    var board4 = [[1,0,0],[0,2,0],[0,0,2]]; // returns -4
*/

module.exports = euristicFunc;
