import React from "react";
import { Grid, Input } from "@mui/material";

import styles from "./game-cell.module.css";

function GameCell({ value, coordX, coordY, onChangeHandler }) {
  return (
    <Grid item xs={1} className={styles.root}>
      <Input
        classes={{ input: styles.input }}
        type="number"
        value={value}
        onChange={(event) => onChangeHandler(event, [coordX, coordY])}
        disableUnderline={true}
        inputProps={{
          min: 0,
          max: 9,
        }}
      />
    </Grid>
  );
}

export default GameCell;
