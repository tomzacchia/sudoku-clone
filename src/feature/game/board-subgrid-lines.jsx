import { Fragment } from "react";
import styles from "./board-subgrid-lines.module.css";

function BoardSubgridLines(props) {
  return (
    <Fragment>
      <div
        className={`${styles["base-bar"]} ${styles["horizontal-base"]} ${styles["horizontal-1"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["horizontal-base"]} ${styles["horizontal-2"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["vertical-base"]} ${styles["vertical-1"]}`}
      ></div>
      <div
        className={`${styles["base-bar"]} ${styles["vertical-base"]} ${styles["vertical-2"]}`}
      ></div>
    </Fragment>
  );
}

export default BoardSubgridLines;
