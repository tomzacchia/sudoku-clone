import { CircularProgress, Box } from "@mui/material";

function CenteredSpinner({ progressHeight, progressWidth }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flex: 1,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress
        sx={{
          height: progressHeight ?? "40px",
          width: progressWidth ?? "40px",
        }}
      />
    </Box>
  );
}

export default CenteredSpinner;
