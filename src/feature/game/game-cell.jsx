import React from "react";
import { Grid, Input } from "@mui/material";
import _ from "lodash";

import styles from "./game-cell.module.css";

function GameCell({
  value,
  isInteractive,
  highlightFlag,
  errorCount,
  coordX,
  coordY,
  onChangeHandler,
  onKeyDownHandler,
  onClickHandler,
}) {
  const shouldHighlightNonInteractiveError = errorCount > 0 && !isInteractive;
  const userErrorFlag = errorCount > 0;
  const shouldDisplayUserError = errorCount > 0 && isInteractive;

  return (
    <Grid
      item
      xs={1}
      classes={{
        root: `
          ${styles["item-root"]} 
          ${highlightFlag && styles["item-root-highlight"]} 
          ${
            shouldHighlightNonInteractiveError &&
            styles["item-non-interactive-error"]
          }
        `,
      }}
    >
      <Input
        classes={{
          root: styles["input-root"],
          input: `${styles.input} ${
            !isInteractive && styles["input-non-interactive"]
          }`,
          error: shouldDisplayUserError && styles["user-error"],
        }}
        type="number"
        value={value}
        error={userErrorFlag}
        disableUnderline={true}
        disabled={!isInteractive}
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

export default React.memo(GameCell);
