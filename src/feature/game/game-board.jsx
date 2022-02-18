import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import GameCell from "./game-cell";
import { DUMMY_BOARD, BOARD_LENGTH, localStorageKeys } from "constants";
import isSolutionValid from "utilities/sudoko-solver";
import Cell from "models/cell.model";
import BoardSubgridLines from "./board-subgrid-lines";
import { localStorage } from "utilities/local-storage";

import styles from "./game-board.module.css";

/**
 *
 * @param {*} untouchedBoard | 9x9 2D array
 * @param {*} userBoard | 9x9 2D array
 * @param {*} selectedCellCoord | [coordX, coordY]
 * @param {*} updateSelectedCell | func
 * @param {*} updateUserBoard | func
 * @returns Component
 */
function GameBoard({
  untouchedBoard,
  userBoard,
  selectedCoord,
  handleSelectedCellAtCoord,
  handleUserInput,
}) {
  const boardCells = compareAndMakeBoardCells(untouchedBoard, userBoard);
  const boardWithHighlightAndErrors = updateAllErrorCounts(
    updateHighlightAtCoord(boardCells, selectedCoord)
  );

  /**
   *
   * @param {*} event | Event object
   * @param {*} coords | [coordX, coorY]
   */
  function changeHandler(event, coord) {
    const userInput = _.flow(
      getLastCharFromNumString,
      convertNumStringToInteger
    )(event.target.value);

    // let newUserBoard = updateValueAtCoord(
    //   event.target.value,
    //   coord,
    //   _.cloneDeep(userBoard)
    // );

    handleUserInput(userInput);
  }

  /**
   * Prevents the user from entering "e", "-", "+", ".", which are valid numbers
   * however we limit user's input to numbers 1 to 9, inclusive
   * @param {*} event
   */
  function keydownHandler(event) {
    // https://www.codegrepper.com/code-examples/javascript/remove+character+at+index+from+string+javascript
    const { key } = event;
    const filteredKeys = new Set(["e", "-", "+", "."]);
    if (filteredKeys.has(key)) {
      event.preventDefault();
    }
  }

  /**
   * Highlights row, column and subgrid that contain user's selected cell
   * @param {*} coordX
   * @param {*} coordY
   */
  function clickHandler(coordX, coordY) {
    handleSelectedCellAtCoord([coordX, coordY]);
  }

  return (
    <Grid container columns={BOARD_LENGTH} className={styles["board-root"]}>
      {boardWithHighlightAndErrors.map((row, coordX) => {
        return row.map((cellConfig, coordY) => (
          <GameCell
            key={`${coordX} ${coordY}`}
            cellConfig={cellConfig}
            coordX={coordX}
            coordY={coordY}
            onChangeHandler={changeHandler}
            onKeyDownHandler={keydownHandler}
            onClickHandler={clickHandler}
          />
        ));
      })}

      {/* 3x3 GRID DIVISION LINES */}
      <BoardSubgridLines />
    </Grid>
  );
}

export default GameBoard;

/**
 * maps untouchedBoard to Cells and updates error count for every cell
 * @param {*} untouchedBoard | from localStorage
 * @param {*} userBoard | from localStorage
 * @returns
 */
function compareAndMakeBoardCells(untouchedBoard, userBoard) {
  return untouchedBoard.map((row, coordX) =>
    row.map((value, coordY) => {
      const cellValue = value || ""; // 0 stored in 2D array defaults to ""
      const isCellInterative = !cellValue;
      const userBoardValue = (userBoard && userBoard[coordX][coordY]) || "";

      return new Cell(cellValue || userBoardValue, isCellInterative);
    })
  );
}

function getAllBoardIndexes() {
  const indexes = [];

  for (let row = 0; row < BOARD_LENGTH; row++) {
    for (let column = 0; column < BOARD_LENGTH; column++) {
      indexes.push([row, column]);
    }
  }

  return indexes;
}

// function extractValuesFromBoard(boardData) {
//   return boardData.map((row) =>
//     row.map((cell) => (cell.value ? cell.value : 0))
//   );
// }

function updateValueAtCoord(rawValue, coord, userBoard) {
  const [coordX, coordY] = coord;
  let userInput = _.flow(
    getLastCharFromNumString,
    convertNumStringToInteger
  )(rawValue);

  const isUserInputZero = userInput && userInput === 0;

  if (isUserInputZero || !userInput) {
    userBoard[coordX][coordY] = 0;
  } else {
    userBoard[coordX][coordY] = userInput;
  }
  return userBoard;
}

function getLastCharFromNumString(numString) {
  return numString && numString[numString.length - 1];
}

function convertNumStringToInteger(numString) {
  return numString && parseInt(numString);
}

function updateHighlightAtCoord(boardData, coord) {
  if (!coord) return boardData;

  const [row, col] = coord;
  const intersectingIndexes = getIntersectingIndexes(row, col);
  return updateHighlightAtIndexes(intersectingIndexes, _.cloneDeep(boardData));
}

function updateHighlightAtIndexes(indexes, boardData) {
  indexes.forEach((index) => {
    const [row, col] = index;
    const cellAtIndex = boardData[row][col];
    cellAtIndex.highlightFlag = true;
  });

  return boardData;
}

function updateAllErrorCounts(boardData) {
  const allIndexes = getAllBoardIndexes();
  const boardWithErrorsUpdated = updateErrorCountForIndexes(
    allIndexes,
    _.cloneDeep(boardData)
  );

  return boardWithErrorsUpdated;
}

/**
 * Receives all row, column or 3x3 grid indexes that contain user coordinate. The function
 * interates through index, i.e [0,0], and counts the number of times the same
 * value exsits in the same row, column AND 3x3 grid
 * @param {*} indexes
 * @param {*} boardData
 * @returns
 */

function updateErrorCountForIndexes(indexes, boardData) {
  indexes.forEach((index) => {
    const [row, col] = index;
    const valueAtIndex = boardData[row][col].value;

    if (!valueAtIndex) return;

    const intersectingIndexes = getIntersectingIndexes(row, col);

    const newErrorCount = intersectingIndexes
      .filter((intersectingIndex) => !_.isEqual(intersectingIndex, index))
      .filter((intersectingIndex) => {
        const [intersectingIndexRow, intersectingIndexCol] = intersectingIndex;

        return (
          boardData[intersectingIndexRow][intersectingIndexCol].value ===
          valueAtIndex
        );
      }).length;

    boardData[row][col].errorCount = newErrorCount;
  });

  return boardData;
}

function getIntersectingIndexes(row, column) {
  return removeRepeatedIndexes([
    ...getCellIndexesInRow(row),
    ...getCellIndexesInColumn(column),
    ...getCellIndexesInSubgrid(row, column),
  ]);
}

/**
 * @param {*} indexes | array of tuples
 */
function removeRepeatedIndexes(indexes) {
  const uniqueIndexes = new Map();

  indexes.forEach((index) => {
    const row = index[0];
    const column = index[1];
    var coordString = `${row}+${column}`;

    if (!uniqueIndexes.has(coordString)) {
      uniqueIndexes.set(coordString, index);
    }
  });

  return Array.from(uniqueIndexes.values());
}

function getCellIndexesInRow(row) {
  const cellIndexes = [];

  for (let column = 0; column < BOARD_LENGTH; column++) {
    cellIndexes.push([row, column]);
  }

  return cellIndexes;
}

function getCellIndexesInColumn(column) {
  const cellIndexes = [];

  for (let row = 0; row < BOARD_LENGTH; row++) {
    cellIndexes.push([row, column]);
  }

  return cellIndexes;
}

function getCellIndexesInSubgrid(row, column) {
  const cellIndexes = [];

  const rowOffset = calculateOffset(row);
  const columnOffset = calculateOffset(column);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rowIndex = rowOffset + i;
      const subgridColumnIndex = columnOffset + j;
      cellIndexes.push([rowIndex, subgridColumnIndex]);
    }
  }

  return cellIndexes;
}

function calculateOffset(num) {
  let offset = 0;

  if (num < 3) {
    offset = 0;
  } else if (num < 6) {
    offset = 3;
  } else {
    offset = 6;
  }

  return offset;
}
