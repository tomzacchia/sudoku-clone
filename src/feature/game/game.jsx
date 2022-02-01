import React, { useState } from "react";
import GameBoard from "./game-board";
import { Card, Grid, StyledEngineProvider, Typography } from "@mui/material";
import FinishMessage from "./finish-message";
import GameHeader from "./game-header";

function Game(props) {
  const [isGameDone, setIsGameDone] = useState(false);

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
