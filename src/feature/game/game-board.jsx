import { Grid } from "@mui/material";
import React, { useState } from "react";
import _ from "lodash";
import GameCell from "./game-cell";
import { DUMMY_BOARD, BOARD_LENGTH } from "constants";
import Cell from "models/cell.model";

import styles from "./game-board.module.css";

/*
  boardState : {
    boardData: [[][]...],
    numberOfEmptyCells: 
    numberOfInvalidCells:
  }
*/

function GameBoard(props) {
  const [gameState, setGameState] = useState(initializeState());

  /**
   *
   * @param {*} event | Event object
   * @param {*} coords | [coordX, coorY]
   */
  function changeHandler(event, [coordX, coordY]) {
    setGameState((prevState) => {
      let prevStateCopy = _.cloneDeep(prevState);

      prevStateCopy = updateValueAtCoord(
        event.target.value,
        [coordX, coordY],
        prevStateCopy
      );

      const intersectingIndexes = getAllIntersectingIndexes(coordX, coordY);

      const newState = updateErrorCountForIndexes(
        intersectingIndexes,
        prevStateCopy
      );

      return newState;
    });
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
    const highlightUserClickedRow = _.curry(updateHighlightForRow)(coordX);
    const highlightUserClickedColumn = _.curry(updateHighlightForColumn)(
      coordY
    );
    const highlightUserClickedSubgrid = _.curry(highlightSubgrid)(
      coordX,
      coordY
    );

    setGameState((prevState) => {
      return _.flow(
        resetHighlight,
        highlightUserClickedRow,
        highlightUserClickedColumn,
        highlightUserClickedSubgrid
      )(_.cloneDeep(prevState));
    });
  }

  return (
    <Grid container columns={BOARD_LENGTH} className={styles["board-root"]}>
      {gameState.map((row, coordX) => {
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
      <div
        className={`${styles["base-bar"]} ${styles["horizontal-base"]} ${styles["horizontal-1"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["horizontal-base"]} ${styles["horizontal-2"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["vertical-base"]} ${styles["vertical-1"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["vertical-base"]} ${styles["vertical-2"]}`}
      ></div>
    </Grid>
  );
}

export default GameBoard;

function initializeState() {
  return DUMMY_BOARD.map((row) => row.map((value) => new Cell(value)));
}

function updateValueAtCoord(rawValue, coord, boardData) {
  const [coordX, coordY] = coord;
  let userInput = _.flow(
    getLastCharFromNumString,
    convertNumStringToInteger
  )(rawValue);

  const isUserInputZero = userInput && userInput === 0;

  if (isUserInputZero || !userInput) {
    boardData[coordX][coordY].value = "";
  } else {
    boardData[coordX][coordY].value = userInput;
  }
  return boardData;
}

function getLastCharFromNumString(numString) {
  return numString && numString[numString.length - 1];
}

function convertNumStringToInteger(numString) {
  return numString && parseInt(numString);
}

function updateHighlightForRow(row, boardData) {
  for (let column = 0; column < BOARD_LENGTH; column++) {
    boardData[row][column].highlightFlag = true;
  }

  return boardData;
}

function updateHighlightForColumn(column, boardData) {
  for (let row = 0; row < BOARD_LENGTH; row++) {
    boardData[row][column].highlightFlag = true;
  }

  return boardData;
}

function highlightSubgrid(row, column, boardData) {
  // row 1-3 offset = 0, row 4-6 offset = 3, row 7-9 offset = 6
  const ROW_OFFSET = calculateOffset(row);
  const COLUMN_OFFSET = calculateOffset(column);

  for (let i = 0; i < 3; i++) {
    const subgridRow = ROW_OFFSET + i;
    for (let j = 0; j < 3; j++) {
      const subgridColumn = COLUMN_OFFSET + j;
      boardData[subgridRow][subgridColumn].highlightFlag = true;
    }
  }

  return boardData;
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

function resetHighlight(boardData) {
  return boardData.map((row) => {
    return row.map((cellData) => ({ ...cellData, highlightFlag: false }));
  });
}

function updateErrorCountForIndexes(indexes, boardData) {
  indexes.forEach((index) => {
    const [row, col] = index;
    const valueAtIndex = boardData[row][col].value;

    if (!valueAtIndex) {
      boardData[row][col].errorCount = 0;
      return;
    }

    const rowIndexes = getCellIndexesInRow(row);
    const columnIndexes = getCellIndexesInColumn(col);
    const subgridIndexes = getCellIndexesInSubgrid(row, col);

    let newErrorCount = 0;

    rowIndexes.forEach(updateNewErrorCount);
    columnIndexes.forEach(updateNewErrorCount);
    subgridIndexes.forEach(updateNewErrorCount);

    boardData[row][col].errorCount = newErrorCount;

    function updateNewErrorCount(coord) {
      const [coordX, coordY] = coord;
      const valueAtCoord = boardData[coordX][coordY].value;

      if (_.isEqual(index, coord)) return;

      if (valueAtIndex === valueAtCoord) newErrorCount += 1;
    }
  });

  return boardData;
}

function getAllIntersectingIndexes(row, column) {
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
