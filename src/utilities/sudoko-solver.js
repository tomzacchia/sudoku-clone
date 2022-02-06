import { BOARD_LENGTH } from "constants/index";

// TODO: add tests for isValidSolution

export default function isValidSolution(board) {
  const areRowsValid = areNestedArraysValid(board);
  const columnsArray = getColumns(board);
  const subgridsArray = getSubgridsArray(board);

  return (
    areRowsValid &&
    areNestedArraysValid(columnsArray) &&
    areNestedArraysValid(subgridsArray)
  );
}

function isSudokuArrayValid(array) {
  const sortedArray = array.slice(0).sort().join("");
  const validArray = [1, 2, 3, 4, 5, 6, 7, 8, 9].join("");

  return sortedArray === validArray;
}

function areNestedArraysValid(nestedArrays) {
  return nestedArrays.every(isSudokuArrayValid);
}

function getColumns(board) {
  const COLUMNS_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return COLUMNS_INDEXES.map((columnIndex) => {
    return board.reduce((acc, row) => [...acc, row[columnIndex]], []);
  });
}

function getSubgridsArray(board) {
  var subgridsArray = createEmptySubArrays();

  for (var row = 0; row < BOARD_LENGTH; row++) {
    for (var column = 0; column < BOARD_LENGTH; column++) {
      var currentNumber = board[row][column];

      var subgridRow = Math.floor(row / 3);
      var subgridColumn = Math.floor(column / 3);
      var subGridIndex = 3 * subgridRow + subgridColumn;

      subgridsArray[subGridIndex].push(currentNumber);
    }
  }

  return subgridsArray;
}

function createEmptySubArrays() {
  var tempArray = [];
  for (var i = 0; i < BOARD_LENGTH; i++) tempArray.push([]);

  return tempArray;
}
