export default class Cell {
  /**
   *
   * @param {*} value | Number || ""
   */
  constructor(value) {
    this.value = value;
    this.isInteractive = value ? false : true;
    this.highlightFlag = false;
    this.errorFlag = false;
    this.errorCount = 0;
  }
}
