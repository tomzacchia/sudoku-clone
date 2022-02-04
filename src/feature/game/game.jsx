import React, { useState, useEffect } from "react";
import GameBoard from "./game-board";
import {
  Box,
  Grid,
  StyledEngineProvider,
  CircularProgress,
} from "@mui/material";
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

  function getGameContent() {
    let content;

    if (board)
      content = <GameBoard board={board} handelGameDone={handleGameDone} />;

    if (isGameDone) content = <FinishMessage />;

    if (error) content = <p> Error Loading Data </p>;

    if (isLoading)
      content = (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flex: 1,
          }}
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress
            sx={{ height: "100px !important", width: "100px !important" }}
          />
        </Box>
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
          {/* <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flex: 1,
            }}
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress
              sx={{ height: "100px !important", width: "100px !important" }}
            />
          </Box> */}
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
