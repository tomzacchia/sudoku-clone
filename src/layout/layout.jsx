import { Grid, Typography } from "@mui/material";

function Layout({ navbar, children }) {
  return (
    <>
      <Grid container sx={{ p: 2 }}>
        {navbar}
      </Grid>
      <Grid container sx={{ p: 2 }}>
        {children}
      </Grid>
    </>
  );
}

export default Layout;
