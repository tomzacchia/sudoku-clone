import { Grid } from "@mui/material";
import React, { useState } from "react";
import _ from "lodash";
import GameCell from "./game-cell";
import { DUMMY_BOARD } from "constants";

function GameBoard(props) {
  const [gameState, setGameState] = useState(DUMMY_BOARD);

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
