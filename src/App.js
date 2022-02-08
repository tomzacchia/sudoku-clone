import { Fragment } from "react";

import Game from "./feature/game/game";
import Gametip from "feature/game/gametip";
import "./App.css";

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

function App() {
  return (
    <Fragment>
      <Game />
      <Gametip />
    </Fragment>
  );
}

export default App;
