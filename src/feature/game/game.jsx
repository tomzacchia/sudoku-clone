import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";

import FinishMessage from "./finish-message";
import GameHeader from "./game-header";
import Controls from "./controls";

import { useGetBoardByDifficulty } from "hooks/game-data.hooks";
import CenteredSpinner from "components/centered-spinner";

function Game(props) {
  const { isLoading, error, board, getBoardData } = useGetBoardByDifficulty();
  const [difficulty, setDifficulty] = useState("easy");
  const [isGameDone, setIsGameDone] = useState(false);

  useEffect(() => {
    getBoardData({ difficulty: "easy" });
  }, [getBoardData]);

  function handleGameDone() {
    setIsGameDone(true);
  }

  function handleDifficultySelection(difficulty) {
    setDifficulty(difficulty);
    getBoardData({ difficulty: difficulty });
  }

  function getGameContent() {
    let content;

    if (board)
      content = <GameBoard board={board} handelGameDone={handleGameDone} />;

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
