export default class Cell {
  /**
   *
   * @param {*} value | Number || ""
   */
  constructor(value, isInteractive) {
    this.value = value;
    this.isInteractive = isInteractive;
    this.highlightFlag = false;
    this.errorFlag = false;
    this.errorCount = 0;
  }
}
