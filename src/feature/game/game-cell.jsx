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
  const itemRootClass = getCellRootClasses(cellConfig);

  const shouldDisplayUserError =
    cellConfig.errorCount > 0 && cellConfig.isInteractive;

  const userErrorFlag = cellConfig.errorCount > 0;

  return (
    <Grid item xs={1} classes={{ root: itemRootClass }}>
      <Input
        classes={{
          root: styles["input-root"],
          input: `${styles.input} ${
            !cellConfig.isInteractive && styles["input-non-interactive"]
          }`,
          error: shouldDisplayUserError && styles["user-error"],
        }}
        type="number"
        value={cellConfig.value}
        error={userErrorFlag}
        disableUnderline={true}
        disabled={!cellConfig.isInteractive}
        inputProps={{
          min: 0,
          max: 9,
        }}
        onChange={(event) => onChangeHandler(event)}
        onKeyDown={onKeyDownHandler}
        onClick={() => onClickHandler(coordX, coordY)}
        onWheel={(e) => e.target.blur()}
      />
    </Grid>
  );
}

export default GameCell;

function getCellRootClasses(cellConfig) {
  let rootBase = styles["item-root"];
  const shouldHighlightNonInteractiveError =
    cellConfig.errorCount > 0 && !cellConfig.isInteractive;

  if (shouldHighlightNonInteractiveError) {
    rootBase += ` ${styles["item-non-interactive-error"]}`;
  } else if (cellConfig.highlightFlag) {
    rootBase += ` ${styles["item-root-highlight"]}`;
  }

  return rootBase;
}
