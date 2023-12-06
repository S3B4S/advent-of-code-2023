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

export class Queue {
  private _store: any[] = [];
  constructor() {}
  enqueue(item: any) {
    this._store.push(item);
  }
  dequeue() {
    return this._store.shift();
  }
  peek() {
    return this._store[0];
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
