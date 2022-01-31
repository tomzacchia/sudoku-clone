import React, { useState } from "react";
import GameBoard from "./game-board";
import { Grid, StyledEngineProvider } from "@mui/material";

function Game(props) {
  const [isGameDone, setIsGameDone] = useState(false);

  function handleGameDone() {
    setIsGameDone(true);
  }

  return (
    <StyledEngineProvider injectFirst>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={5}>
          {!isGameDone && <GameBoard handelGameDone={handleGameDone} />}
          {isGameDone && <p>CONGRATS!</p>}
        </Grid>
        <Grid item xs={5}>
          <section> CONTROLS </section>
        </Grid>
      </Grid>
    </StyledEngineProvider>
  );
}

export default Game;
