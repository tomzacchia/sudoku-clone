import React from "react";
import { Grid, Input } from "@mui/material";
import _ from "lodash";

import styles from "./game-cell.module.css";

function GameCell({
  cellConfig,
  coordX,
  coordY,
  onChangeHandler,
  onKeyDownHandler,
}) {
  let itemRootClass = styles["item-root"];
  let shouldDisplayUserError = cellConfig.errorFlag && cellConfig.isInteractive;

  if (cellConfig.highlightFlag)
    itemRootClass += ` ${styles["item-root-highlight"]}`;

  if (cellConfig.errorFlag && !cellConfig.isInteractive)
    itemRootClass += ` ${styles["item-non-interactive-error"]}`;

  return (
    <Grid item xs={1} classes={{ root: itemRootClass }}>
      <Input
        classes={{
          root: styles["input-root"],
          input: styles.input,
          error: shouldDisplayUserError && styles["user-error"],
        }}
        type="number"
        value={cellConfig.value}
        error={cellConfig.errorFlag}
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
  return _.isEqual(prevProps.cellConfig, newProps.cellConfig);
}
