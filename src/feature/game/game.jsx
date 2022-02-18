import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";
import _ from "lodash";

import { localStorage } from "utilities/local-storage";
import { useGetBoardByDifficulty } from "hooks/game-data.hooks";
import { localStorageKeys } from "constants/index";

import FinishMessage from "./finish-message";
import GameHeader from "./game-header";
import Controls from "./controls";
import CenteredSpinner from "components/centered-spinner";

/**
 * TODO:
 *  1) pass userBoard into GameBoard as prop
 *  2) keep userLocation in state
 *  3) handleUserInput(), save to local and update state
 *  4) define a const that is the result of comparing untouchedBoard and userBoard before
 *      it gets passed down as prop. If they are identical, show success
 */

function Game(props) {
  const { isLoading, error, setIsLoading, getBoardData } =
    useGetBoardByDifficulty();
  const [untouchedBoard, setUntouchedBoard] = useState(() =>
    getFromLocalByKey(localStorageKeys.untouchedBoard)
  );
  const [userBoard, setUserBoard] = useState(() =>
    getFromLocalByKey(localStorageKeys.userBoard)
  );
  const [difficulty, setDifficulty] = useState(
    () => getFromLocalByKey(localStorageKeys.difficulty) || "easy"
  );
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [isGameDone, setIsGameDone] = useState(false);

  // TODO: refactor this
  useEffect(() => {
    const isNewGame = !untouchedBoard && !userBoard;

    if (isNewGame) {
      setIsGameDone(false);

      async function fetchData() {
        const data = await getBoardData({ difficulty: difficulty });
        setUntouchedBoard(data);
        setUserBoard(data);

        localStorage.set(localStorageKeys.untouchedBoard, data);
        localStorage.set(localStorageKeys.userBoard, data);
      }

      fetchData();
    }
    localStorage.set(localStorageKeys.difficulty, difficulty);
  }, [getBoardData, untouchedBoard, userBoard, difficulty]);

  function handleSelectedCellAtCoord(coord) {
    setSelectedCoord(coord);
  }

  function handleUserInput(newValue) {
    const [row, col] = selectedCoord;
    let updatedUserBoard = _.cloneDeep(userBoard);
    updatedUserBoard[row][col] = newValue;

    localStorage.set(localStorageKeys.userBoard, updatedUserBoard);
    setUserBoard(updatedUserBoard);
  }

  function handleDifficultySelection(difficulty) {
    localStorage.remove(localStorageKeys.untouchedBoard);
    localStorage.remove(localStorageKeys.userBoard);
    setUntouchedBoard(null);
    setUserBoard(null);
    setDifficulty(difficulty);
    setSelectedCoord(null);
  }

  function handleReset() {
    localStorage.set(localStorageKeys.userBoard, untouchedBoard);
    setUserBoard(untouchedBoard);
    setSelectedCoord(null);
  }

  function getGameContent() {
    let content;

    if (untouchedBoard)
      content = (
        <GameBoard
          untouchedBoard={untouchedBoard}
          userBoard={userBoard}
          selectedCoord={selectedCoord}
          handleSelectedCellAtCoord={handleSelectedCellAtCoord}
          handleUserInput={handleUserInput}
        />
      );

    if (isGameDone) content = <FinishMessage difficulty={difficulty} />;

    if (error) content = <p> Error Loading Data </p>;

    if (isLoading)
      content = (
        <CenteredSpinner
          progressHeight={"100px !important"}
          progressWidth={"100px !important"}
        />
      );

    return content;
  }

  return (
    <StyledEngineProvider injectFirst>
      <GameHeader difficulty={difficulty} />

      <Grid
        container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <Grid
          item
          xs={5}
          sx={{
            m: "auto",
            minHeight: "454px",
            width: "590px",
            display: "flex",
          }}
          flexDirection="column"
        >
          {getGameContent()}
        </Grid>

        <Grid item xs={5} sx={{ mt: 2 }}>
          <Controls
            onDifficultyClick={handleDifficultySelection}
            onResetClick={handleReset}
            disabledReset={isGameDone}
          />
        </Grid>
      </Grid>
    </StyledEngineProvider>
  );
}

export default Game;

function getFromLocalByKey(key) {
  const data = localStorage.get(key);
  return data || null;
}
