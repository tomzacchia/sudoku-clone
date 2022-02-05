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
  const { isLoading, error, getBoardData } = useGetBoardByDifficulty();
  const [untouchedBoard, setUntouchedBoard] = useState(() =>
    getFromLocalByKey("untouchedBoard")
  );
  const [userBoard, setUserBoard] = useState(() =>
    getFromLocalByKey("userboard")
  );
  const [difficulty, setDifficulty] = useState("easy");
  const [isGameDone, setIsGameDone] = useState(false);

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
    }
    // todo: on refresh check if untouched and user board exist in local

    // TODO: add state for user Board, every API call causes update in localStorage
    // todo: only fetch if userBoard and untouchedBoard do not exist, save in local and to state
    // todo: on reset set userBoard state to untouchedBoard
  }, [getBoardData, untouchedBoard, userBoard, difficulty]);

  function handleGameDone() {
    setIsGameDone(true);
  }

  function handleDifficultySelection(difficulty) {
    setDifficulty(difficulty);
    setUserBoard(null);
    setUntouchedBoard(null);
  }

  function handleReset() {
    // clear userBoard in localStorage
    // clear userBoard in component state
  }

  function getGameContent() {
    let content;

    if (untouchedBoard)
      content = (
        <GameBoard board={untouchedBoard} handelGameDone={handleGameDone} />
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
