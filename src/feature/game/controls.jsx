import React from "react";

import { Button } from "@mui/material";
import { difficulties } from "constants";

function Controls({ onDifficultyClick, onResetClick, disabledReset }) {
  const difficultiesButtons = difficulties.map((difficulty) => (
    <Button
      key={difficulty}
      onClick={() => onDifficultyClick(difficulty)}
      variant="outlined"
      sx={{ ml: 2, mr: 2 }}
    >
      {difficulty}
    </Button>
  ));
  return (
    <React.Fragment>
      {difficultiesButtons}
      <Button
        onClick={onResetClick}
        variant="outlined"
        color="error"
        sx={{ ml: 2, mr: 2 }}
        disabled={disabledReset}
      >
        reset
      </Button>
    </React.Fragment>
  );
}

export default Controls;
