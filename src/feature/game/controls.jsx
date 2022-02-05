import { Button } from "@mui/material";

import { difficulties } from "constants";

function Controls({ onClick }) {
  const content = difficulties.map((difficulty) => (
    <Button
      key={difficulty}
      onClick={() => onClick(difficulty)}
      variant="outlined"
      sx={{ ml: 2, mr: 2 }}
    >
      {difficulty}
    </Button>
  ));
  return content;
}

export default Controls;
