export default class Cell {
  /**
   *
   * @param {*} value | Number || ""
   */
  constructor(value) {
    this.value = value;
    this.highlightFlag = false;
    this.errorFlag = false;
    this.isInteractive = value ? false : true;
    this.errorCount = 0;
  }
}
