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
  const [userBoard, setUserBoard] = useState(() =>
    getFromLocalByKey(localStorageKeys.userBoard)
  );
  const [difficulty, setDifficulty] = useState("easy");
  const [isGameDone, setIsGameDone] = useState(false);

  // All side effects (fetching from API or localStorae) are contained here
  useEffect(() => {
    const isNewGame = !userBoard && !untouchedBoard;
    const isResetGame = !userBoard;

    if (isNewGame) {
      async function fetchData() {
        const data = await getBoardData({ difficulty: difficulty });
        setUntouchedBoard(data);
        setUserBoard(data);

        localStorage.set(localStorageKeys.untouchedBoard, data);
        localStorage.set(localStorageKeys.userBoard, data);
      }

      fetchData();
    } else if (isResetGame) {
      setUserBoard(untouchedBoard);
      setIsLoading(false);
      localStorage.set(localStorageKeys.userBoard, untouchedBoard);
    }
  }, [getBoardData, untouchedBoard, userBoard, difficulty, setIsLoading]);

  function handleGameDone() {
    setIsGameDone(true);
  }

  function handleDifficultySelection(difficulty) {
    setDifficulty(difficulty);
    setUserBoard(null);
    setUntouchedBoard(null);
  }

  function handleReset() {
    setUserBoard(null);
    setIsLoading(true);
  }

  function getGameContent() {
    let content;

    if (userBoard)
      content = (
        <GameBoard
          userBoard={userBoard}
          untouchedBoard={untouchedBoard}
          handelGameDone={handleGameDone}
        />
      );

    if (isGameDone) content = <FinishMessage />;

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
          <Controls onClick={handleDifficultySelection} />
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
