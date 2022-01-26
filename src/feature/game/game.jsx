import React from "react";
import GameBoard from "./game-board";
import { Grid } from "@mui/material";

function Game(props) {
  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={4}>
        <GameBoard />
      </Grid>
      <Grid item xs={4}>
        <section> CONTROLS </section>
      </Grid>
    </Grid>
  );
}

export default Game;
