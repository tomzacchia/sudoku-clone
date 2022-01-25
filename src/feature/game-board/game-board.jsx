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
    console.log(event.target.value);
    setGameState((prevState) => {
      // make deep copy since properties are deeply nested
      const prevStateCopy = _.cloneDeep(prevState);

      let userInput = formatValueToSingleDigit(event.target.value);

      const isInputZero = userInput === 0;
      if (isInputZero) return prevStateCopy;

      const isUserInputSameAsPrevious =
        userInput === prevStateCopy[coordX][coordY];

      if (isUserInputSameAsPrevious) {
        prevStateCopy[coordX][coordY] = "";
      } else {
        prevStateCopy[coordX][coordY] = userInput;
      }
      return prevStateCopy;
    });
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
          />
        ));
      })}
    </Grid>
  );
}

export default GameBoard;

function formatValueToSingleDigit(value) {
  if (value.length > 1) {
    const firstDigitPlace = 1;
    value = value[firstDigitPlace];
  }

  value = value && parseInt(value);

  return value;
}
