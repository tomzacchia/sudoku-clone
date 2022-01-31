import React, { useState } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";
import FinishMessage from "./finish-message";

function Game(props) {
  const [isGameDone, setIsGameDone] = useState(false);

  function handleGameDone() {
    setIsGameDone(true);
  }

  return (
    <StyledEngineProvider injectFirst>
      <Grid
        container
        justifyContent="center"
        spacing={3}
        style={{ height: "100vh" }}
      >
        <Grid item xs={5} sx={{ m: "auto", height: "540px" }}>
          {!isGameDone && <GameBoard handelGameDone={handleGameDone} />}
          {isGameDone && <FinishMessage />}
          {/* <FinishMessage /> */}
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
