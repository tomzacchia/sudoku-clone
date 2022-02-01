import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import GameCell from "./game-cell";
import { DUMMY_BOARD, BOARD_LENGTH } from "constants";
import isSolutionValid from "utilities/sudoko-solver";
import Cell from "models/cell.model";

import styles from "./game-board.module.css";

function GameBoard({ handelGameDone }) {
  const [gameState, setGameState] = useState(initializeState());

  useEffect(() => {
    const isUserSolutionValid = isSolutionValid(
      extractValuesFromBoard(gameState)
    );

    if (isUserSolutionValid) {
      console.log("congrats!");
      handelGameDone();
    }
  });

  /**
   *
   * @param {*} event | Event object
   * @param {*} coords | [coordX, coorY]
   */
  function changeHandler(event, coord) {
    setGameState((prevState) => {
      const [coordX, coordY] = coord;

      let newState = updateValueAtCoord(
        event.target.value,
        coord,
        _.cloneDeep(prevState)
      );

      const intersectingIndexes = getAllIntersectingIndexes(coordX, coordY);

      newState = updateErrorCountForIndexes(
        intersectingIndexes,
        _.cloneDeep(newState)
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
    setGameState((prevState) => {
      const newState = resetHighlight(_.cloneDeep(prevState));
      const intersectingIndexes = getAllIntersectingIndexes(coordX, coordY);

      return updateHighlightForIndexes(intersectingIndexes, newState);
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

export default React.memo(GameBoard, deepCompareStates);

function deepCompareStates(prevProps, newProps) {
  return _.isEqual(prevProps.cellConfig, newProps.cellConfig);
}

function initializeState() {
  return DUMMY_BOARD.map((row) => row.map((value) => new Cell(value)));
}

function extractValuesFromBoard(boardData) {
  return boardData.map((row) => row.map((cell) => cell.value));
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

function resetHighlight(boardData) {
  return boardData.map((row) => {
    return row.map((cellData) => ({ ...cellData, highlightFlag: false }));
  });
}

function updateHighlightForIndexes(indexes, boardData) {
  indexes.forEach((index) => {
    const [row, col] = index;
    const cellAtIndex = boardData[row][col];
    cellAtIndex.highlightFlag = true;
  });

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

    if (!valueAtIndex) {
      boardData[row][col].errorCount = 0;
      return;
    }

    let newErrorCount = 0;

    // get all intersection at index
    getCellIndexesInRow(row).forEach(updateNewErrorCount);
    getCellIndexesInColumn(col).forEach(updateNewErrorCount);
    getCellIndexesInSubgrid(row, col).forEach(updateNewErrorCount);

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
