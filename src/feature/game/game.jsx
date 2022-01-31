import React from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";

function Game(props) {
  return (
    <StyledEngineProvider injectFirst>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={5}>
          <GameBoard />
        </Grid>
        <Grid item xs={5}>
          <section> CONTROLS </section>
        </Grid>
      </Grid>
    </StyledEngineProvider>
  );
}

export default Game;
