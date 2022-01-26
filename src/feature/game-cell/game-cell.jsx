import React from "react";
import { Grid, Input } from "@mui/material";

import styles from "./game-cell.module.css";
import _ from "lodash";

function GameCell({
  value,
  coordX,
  coordY,
  onChangeHandler,
  onKeyDownHandler,
}) {
  console.log("GAME CELL RENDERED");
  return (
    <Grid item xs={1} className={styles.root}>
      <Input
        classes={{ input: styles.input }}
        type="number"
        value={value}
        onChange={(event) => onChangeHandler(event, [coordX, coordY])}
        onKeyDown={onKeyDownHandler}
        disableUnderline={true}
        inputProps={{
          min: 0,
          max: 9,
        }}
      />
    </Grid>
  );
}

export default React.memo(GameCell, deepCompareStates);

function deepCompareStates(prevProps, newProps) {
  // TODO: deep compare input config object to minimize re-renders
  // _.isEqual(prevState, newState)
  return prevProps.value === newProps.value;
}
