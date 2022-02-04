import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

function GameHeader(props) {
  return (
    <Grid container justifyContent="space-between" sx={{ mt: 4 }}>
      <Grid item xs={3} textAlign="center" sx={{ pl: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Difficulty: Easy
        </Typography>
      </Grid>
      <Grid item xs={3} textAlign="center" sx={{ pl: 2 }}>
        {/* TODO: TIMER */}
        {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          01:00
        </Typography> */}
      </Grid>
    </Grid>
  );
}

export default GameHeader;
