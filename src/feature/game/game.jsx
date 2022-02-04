import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import { Card, Grid, StyledEngineProvider, Typography } from "@mui/material";
import FinishMessage from "./finish-message";
import GameHeader from "./game-header";

import { useGetBoardByDifficulty } from "hooks/game-data.hooks";

function Game(props) {
  const { isLoading, error, board, execute } = useGetBoardByDifficulty();
  const [isGameDone, setIsGameDone] = useState(false);

  useEffect(() => {
    console.log("getting initial data");
    execute({ difficulty: "easy" });
  }, [execute]);

  function handleGameDone() {
    setIsGameDone(true);
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
          sx={{ m: "auto", height: "540px", width: "590px" }}
          // style={{ height: "540px", width: "590px" }}
        >
          {!isGameDone && <GameBoard handelGameDone={handleGameDone} />}
          {isGameDone && <FinishMessage />}
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
