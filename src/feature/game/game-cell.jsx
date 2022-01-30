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
  onClickHandler,
}) {
  // TODO: function that returns all styles in order of precendnce
  let itemRootClass = styles["item-root"];
  let shouldDisplayUserError =
    cellConfig.errorCount > 0 && cellConfig.isInteractive;
  const errorFlag = cellConfig.errorCount > 0;

  if (cellConfig.highlightFlag)
    itemRootClass += ` ${styles["item-root-highlight"]}`;

  if (cellConfig.errorCount > 0 && !cellConfig.isInteractive)
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
        error={errorFlag}
        onChange={(event) => onChangeHandler(event, [coordX, coordY])}
        onKeyDown={onKeyDownHandler}
        onClick={() => onClickHandler(coordX, coordY)}
        disableUnderline={true}
        disabled={!cellConfig.isInteractive}
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
