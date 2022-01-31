import React, { useState } from "react";
import GameBoard from "./game-board";
import { Card, Grid, StyledEngineProvider, Typography } from "@mui/material";
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
        flexDirection="column"
        spacing={3}
        style={{ height: "100vh" }}
      >
        <Grid
          item
          xs={5}
          sx={{ m: "auto" }}
          style={{ minHeight: "540px", minWidth: "590px" }}
        >
          <Card>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Difficulty: Easy
            </Typography>
          </Card>
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
