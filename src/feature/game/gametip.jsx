import React from "react";
import { localStorage } from "utilities/local-storage";
import { localStorageKeys } from "constants/index";
import { Modal, Typography, Box } from "@mui/material";
import { useState } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#0072e3",
  boxShadow: 24,
  p: 4,
  outline: 0,
  color: "white",
};

function Gametip(props) {
  const [showGametip, setShowGametip] = useState(() => {
    let showGametip = localStorage.get(localStorageKeys.showGametip);
    if (showGametip === undefined) showGametip = true;

    return showGametip;
  });

  function handleModalClose() {
    setShowGametip(false);
    localStorage.set(localStorageKeys.showGametip, false);
  }
  return (
    <Modal
      open={showGametip}
      onClose={handleModalClose}
      aria-describedby="gametip-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="gametip-modal-description">
          Tap a cell and enter a number to fill in the cell. Select "demo" to
          see game behaviour when all numbers are entered correctly.
        </Typography>
      </Box>
    </Modal>
  );
}

export default Gametip;
