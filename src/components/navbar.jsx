import { Typography, Grid } from "@mui/material";

function Navbar(props) {
  return (
    <>
      <Grid item xs={2}></Grid>
      <Grid item xs={4}>
        <Typography variant="h3" style={{ fontWeight: "bold" }}>
          Sudoku
        </Typography>
      </Grid>
    </>
  );
}

export default Navbar;
