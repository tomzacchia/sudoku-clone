import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

function GameHeader({ difficulty }) {
  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={3} textAlign="left" sx={{ display: "flex" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Difficulty:
        </Typography>
        <Typography variant="h5" sx={{ ml: 2, fontWeight: "normal" }}>
          {difficulty}
        </Typography>
      </Grid>
      <Grid item xs={2} textAlign="center" sx={{ pl: 2 }}>
        {/* TODO: TIMER */}
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          01:00
        </Typography> */}
      </Grid>
    </Grid>
  );
}

export default GameHeader;
