import { Grid } from "@mui/material";
import React, { useState } from "react";
import _ from "lodash";
import GameCell from "../game-cell/game-cell";

const DUMMY_BOARD = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function GameBoard(props) {
  const [gameState, setGameState] = useState(DUMMY_BOARD);

  /**
   *
   * @param {*} event
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
        prevStateCopy[coordX][coordY] = prevState[coordX][coordY];
      } else {
        prevStateCopy[coordX][coordY] = userInput;
      }

      return prevStateCopy;
    });
  }

  // prevent any input equal to "e", "-", "+", "."
  function keydownHandler(event) {
    // https://www.codegrepper.com/code-examples/javascript/remove+character+at+index+from+string+javascript
    const { key } = event;
    const filteredKeys = new Set(["e", "-", "+", "."]);
    if (filteredKeys.has(key)) {
      event.preventDefault();
    }
  }

  return (
    // TODO: add constant for # of columns
    <Grid container columns={9}>
      {gameState.map((row, coordX) => {
        return row.map((cellValue, coordY) => (
          <GameCell
            key={`${coordX} ${coordY}`}
            value={cellValue}
            coordX={coordX}
            coordY={coordY}
            onChangeHandler={changeHandler}
            onKeyDownHandler={keydownHandler}
          />
        ));
      })}
    </Grid>
  );
}

export default GameBoard;

function getLastCharFromNumString(numString) {
  return numString && numString[numString.length - 1];
}

function convertNumStringToInteger(numString) {
  return numString && parseInt(numString);
}
