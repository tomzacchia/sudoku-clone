import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";

import FinishMessage from "./finish-message";
import GameHeader from "./game-header";

import { useGetBoardByDifficulty } from "hooks/game-data.hooks";
import CenteredSpinner from "components/centered-spinner";

function Game(props) {
  const { isLoading, error, board, execute } = useGetBoardByDifficulty();
  const [isGameDone, setIsGameDone] = useState(false);

  useEffect(() => {
    execute({ difficulty: "easy" });
  }, [execute]);

  function handleGameDone() {
    setIsGameDone(true);
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
      <GameHeader />

      <Grid
        container
        justifyContent="center"
        flexDirection="column"
        sx={{ mt: 4 }}
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
        {/* TODO: CONTROLS */}
        {/* <Grid item xs={5}>
          <section> CONTROLS </section>
        </Grid> */}
      </Grid>
    </StyledEngineProvider>
  );
}

export default Game;
