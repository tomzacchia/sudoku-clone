// https://dev.to/soorajsnblaze333/simple-javascript-modules-local-storage-module-567p

class JSONStorage {
  constructor(storage) {
    if (!storage || typeof storage !== "object")
      throw new Error(`Expected a Storage object, got ${storage}`);
    this.storage = storage;
  }
  set(key, value) {
    const str = JSON.stringify(value);
    if (typeof str === "undefined") return this.storage.removeItem(key);
    this.storage.setItem(key, value);
  }
  get(key) {
    const str = this.storage.getItem(key);

    if (str === null) return; // returns undefined if key does not exist
    return JSON.parse(str);
  }
  remove(key) {
    this.storage.removeItem(key);
  }
}

export const localStorage = new JSONStorage(window.localStorage);
