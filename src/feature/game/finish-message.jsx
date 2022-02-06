import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Grid } from "@mui/material";

import styles from "./finish-message.module.css";

function FinishMessage({ difficulty }) {
  return (
    <Card className={styles["card-root"]}>
      <CardContent style={{ margin: "auto", minWidth: "200px" }}>
        <Typography variant="h4" component="div" align="center">
          Excellent!
        </Typography>
        <Grid container justifyContent="space-between" sx={{ mt: 4 }}>
          <Typography variant="h5"> Difficulty </Typography>

          <Typography variant="h5"> {difficulty} </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FinishMessage;
