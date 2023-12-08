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

export class BinaryTree {
  public value: any;
  public left?: BinaryTree;
  public right?: BinaryTree;
  
  constructor(value: any, left?: BinaryTree, right?: BinaryTree) {
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

  setLeft(node: BinaryTree) {
    this.left = node;
  }

  setRight(node: BinaryTree) {
    this.right = node;
  }

  setEdge(node: BinaryTree, direction: "left" | "right") {
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