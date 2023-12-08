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

export class Queue<T> {
  private _store: T[] = [];
  constructor() {}
  enqueue(item: T) {
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

export class BinaryGraphNode {
  public value: any;
  public left?: BinaryGraphNode;
  public right?: BinaryGraphNode;
  
  constructor(value: any, left?: BinaryGraphNode, right?: BinaryGraphNode) {
    this.value = value;
    this.left = left
    this.right = right
  }

  getLeft() {
    return this.left;
  }

  getRight() {
    return this.right;
  }

  setLeft(node: BinaryGraphNode) {
    this.left = node;
  }

  setRight(node: BinaryGraphNode) {
    this.right = node;
  }
  
  setEdge(node: BinaryGraphNode, direction: "left" | "right") {
    this[direction] = node;
  }

  hasEdge(direction: "left" | "right") {
    return !!this[direction];
  }

  hasEdges() {
    return Boolean(this.left || this.right)
  }

  followEdge(direction: "left" | "right") {
    return this[direction];
  }
}

export class RepeatingSequence {
  private _store: any[] = [];
  private _index: number = 0;
  
  constructor(input: any[]) {
    this._store = input;
  }

  next() {
    if (this._index === this._store.length) {
      this._index = 0;
    }
    const value = this._store[this._index];
    this._index++;
    return value;
  }
}