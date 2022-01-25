import { Grid } from "@mui/material";
import React from "react";

function GameBoard(props) {
  return (
    // TODO: add constant for columns
    <Grid container columns={9}>
      {Array.from(Array(9)).map((_, index) => (
        <Grid item xs={1} key={index}>
          <p> {index + 1} </p>
        </Grid>
      ))}
    </Grid>
  );
}

export default GameBoard;
