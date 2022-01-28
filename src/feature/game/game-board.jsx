import { Grid } from "@mui/material";
import React, { useReducer, useState } from "react";
import _ from "lodash";
import GameCell from "./game-cell";
import { DUMMY_BOARD, BOARD_LENGTH } from "constants";
import Cell from "models/cell.model";

import styles from "./game-board.module.css";

function boardReducer(state, action) {
  switch (action.type) {
    case "":
      break;

    default:
      break;
  }
}

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
      // make deep copy since properties are deeply nested
      const prevStateCopy = _.cloneDeep(prevState);

      let userInput = _.flow(
        getLastCharFromNumString,
        convertNumStringToInteger
      )(event.target.value);

      const isInputZero = userInput === 0;

      if (isInputZero || !userInput) {
        prevStateCopy[coordX][coordY].value = prevState[coordX][coordY].value;
      } else {
        prevStateCopy[coordX][coordY].value = userInput;
      }

      return prevStateCopy;
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

  function makeCellsGroupedBySubgrids() {
    const subgrids = createEmptySubgridArrays(); // [[]...[]]

    gameState.forEach((row, coordX) => {
      const rowOffset = calculateOffset(coordX);
      row.forEach((cellConfig, coordY) => {
        const columnOffset = calculateColumnOffset(coordY);
        const subgridIndex = rowOffset + columnOffset;

        subgrids[subgridIndex].push(
          <GameCell
            key={`${coordX} ${coordY}`}
            cellConfig={cellConfig}
            coordX={coordX}
            coordY={coordY}
            onChangeHandler={changeHandler}
            onKeyDownHandler={keydownHandler}
            onClickHandler={clickHandler}
          />
        );
      });
    });

    return subgrids.map((subgridContent, index) => (
      <Grid item xs={3} key={`subgrid_${index}`}>
        {subgridContent}
      </Grid>
    ));
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

function createEmptySubgridArrays() {
  var tempArray = [];

  for (let i = 0; i < BOARD_LENGTH; i++) {
    tempArray.push([]);
  }

  return _.cloneDeep(tempArray);
}

function initializeState() {
  return DUMMY_BOARD.map((row) => row.map((value) => new Cell(value)));
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

function calculateColumnOffset(num) {
  let offset = 0;

  if (num < 3) {
    offset = 0;
  } else if (num < 6) {
    offset = 1;
  } else {
    offset = 2;
  }

  return offset;
}

function resetHighlight(boardData) {
  return boardData.map((row) => {
    return row.map((cellData) => ({ ...cellData, highlightFlag: false }));
  });
}
