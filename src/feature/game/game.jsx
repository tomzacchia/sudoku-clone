import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";

import { localStorage } from "utilities/local-storage";
import { useGetBoardByDifficulty } from "hooks/game-data.hooks";
import { localStorageKeys } from "constants/index";

import FinishMessage from "./finish-message";
import GameHeader from "./game-header";
import Controls from "./controls";
import CenteredSpinner from "components/centered-spinner";

function Game(props) {
  const { isLoading, error, setIsLoading, getBoardData } =
    useGetBoardByDifficulty();
  const [untouchedBoard, setUntouchedBoard] = useState(() =>
    getFromLocalByKey(localStorageKeys.untouchedBoard)
  );
  const [difficulty, setDifficulty] = useState(
    () => getFromLocalByKey(localStorageKeys.difficulty) || "easy"
  );
  const [isGameDone, setIsGameDone] = useState(false);

  useEffect(() => {
    const isNewGame = !untouchedBoard;

    if (isNewGame) {
      setIsGameDone(false);
      localStorage.remove(localStorageKeys.untouchedBoard);
      localStorage.remove(localStorageKeys.userBoard);

      async function fetchData() {
        const data = await getBoardData({ difficulty: difficulty });
        setUntouchedBoard(data);

        localStorage.set(localStorageKeys.untouchedBoard, data);
        // NOTE: GameBoard component sets userBoard in localStorage
      }

      fetchData();
    }
    localStorage.set(localStorageKeys.difficulty, difficulty);
  }, [getBoardData, untouchedBoard, difficulty]);

  function handleGameDone() {
    setIsGameDone(true);
  }

  function handleDifficultySelection(difficulty) {
    setDifficulty(difficulty);
    setUntouchedBoard(null);
  }

  const turnOffLoadingTimeout = React.useRef(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }).current;

  function handleReset() {
    setIsLoading(true);
    localStorage.remove(localStorageKeys.userBoard);

    turnOffLoadingTimeout();
  }

  function getGameContent() {
    let content;

    if (untouchedBoard)
      content = (
        <GameBoard
          untouchedBoard={untouchedBoard}
          handelGameDone={handleGameDone}
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

  // cleanup setTimeout callback
  useEffect(() => {
    return () => {
      clearTimeout(turnOffLoadingTimeout);
    };
  }, [turnOffLoadingTimeout]);

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
