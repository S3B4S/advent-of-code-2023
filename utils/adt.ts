export class Stack {
  private _store: any[] = [];
  constructor() {}
  push(item: any) {
    this._store.push(item);
  }
  pop() {
    return this._store.pop();
  }
  peek() {
    return this._store[this._store.length - 1];
  }
  isEmpty() {
    return this._store.length === 0;
  }
  size() {
    return this._store.length;
  }
  clear() {
    this._store = [];
  }
  print() {
    console.log(this._store);
  }
}
