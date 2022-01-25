import React from "react";
import { Grid, Input } from "@mui/material";

import styles from "./game-cell.module.css";

function GameCell({ value }) {
  return (
    <Grid item xs={1} className={styles.root}>
      <Input
        classes={{ input: styles.input }}
        type="number"
        // value={value}
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
