function euristicFunc (board, cellValue) {
    var euristicValue = 0;
    var boardDimension = 3;
    for (var i = 0; i < boardDimension; i++) {
        euristicValue += checkRow(board, i, cellValue);
        euristicValue += checkCol(board, i, cellValue);
    };

    euristicValue += checkDiagonal(board, cellValue);
    euristicValue += checkDiagonal(board, cellValue, true);

    return euristicValue;
};

function checkRow (board, row, cell) {
    return check(board, row, cell)
};

function checkCol (board, col, cell) {
    return check(board, col, cell, true);
};

function check (board, index, cell, isCol) {
    var euriCheckVal = 0;
    if(!!isCol) {
        // we are checking a row
        for (var i = 0; i < 3; i++) {
            if (board[index][i] === cell) {
                euriCheckVal++;
            }
            else if(board[index][i] !== cell && board[index][i] !== 0) {
                euriCheckVal--;
            }
        };
    }
    else {
        // we are checking a column
        for (var i = 0; i < 3; i++) {
            if (board[i][index] === cell) {
                euriCheckVal++;
            }
            else if(board[i][index] !== cell && board[i][index] !== 0) {
                euriCheckVal--;
            }
        };
    }
    // possible return values in interval [-2, 2]
    return euriCheckVal;
}

function checkDiagonal (board, cell, checkOpposite) {
    var euriCheckVal = 0;
    if(!!checkOpposite) {
        // check normal diagonal
        for (var i = 0; i < 3; i++) {
            if (board[i][i] === cell) {
                euriCheckVal++;
            }
            else if(board[i][i] !== cell && board[i][i] !== 0) {
                euriCheckVal--;
            }
        };

    }
    else {
        // check reverse diagonal
        for (var i = 2; i >= 0; i--) {
            var j = i -2;
            if(j < 0) {
                j = -j;
            }
            if (board[i][j] === cell) {
                euriCheckVal++;
            }
            else if(board[i][j] !== cell && board[i][j] !== 0) {
                euriCheckVal--;
            }
        };
    }
    return euriCheckVal;
}

/*
    TODO: add more tests

    sample Board tests for the euristic function
    var board1 = [[1,0,0],[0,0,0],[0,0,0]]; // returns 3
    var board2 = [[1,0,0],[0,1,0],[0,0,0]]; // returns 7
    var board3 = [[1,0,0],[0,0,0],[0,0,2]]; // returns 0
    var board4 = [[1,0,0],[0,2,0],[0,0,2]]; // returns -4
*/

module.exports = euristicFunc;
