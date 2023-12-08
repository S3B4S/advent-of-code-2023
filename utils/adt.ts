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

type Edges = Record<"left" | "right", GraphNode> 

export class GraphNode {
  public value: any;
  public edges: Edges;
  
  constructor(value: any) {
    this.value = value;
    this.edges = {} as Edges
  }

  addEdge(node: GraphNode, direction: "left" | "right") {
    this.edges[direction] = node;
  }

  hasEdge(direction: "left" | "right") {
    return !!this.edges[direction];
  }

  hasEdges() {
    return Object.keys(this.edges).length > 0;
  }

  followEdge(direction: "left" | "right") {
    return this.edges[direction];
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