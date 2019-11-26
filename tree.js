function Tree(data = null, compare = null) {
  this.data = data; this.root = null; this.left = null; this.right = null;
  this.compare = compare || ((a,b) => a < b ? -1 : (a > b ? 1 : (a === b ? 0 : -2)));
  this.__proto__ = {
    _swap: swap => {
      let old = new Tree(this.data, this.compare); old.root = this.root;
      if (this.root !== null) { this.root.left === this ? this.root.left = old : this.root.right = old; }
      old.left = this.left;
      if (this.left !== null) { this.left.root = old; }
      old.right = this.right;
      if (this.right !== null) { this.right.root = old; }
      this.data = swap.data; this.root = swap.root;
      if (swap.root !== null) { swap.root.left === swap ? swap.root.left = this : swap.root.right = this; }
      this.left = swap.left;
      if (swap.left !== null) { swap.left.root = this; }
      this.right = swap.right;
      if (swap.right !== null) { swap.right.root = this; }
    },

    toAry: () => this._inOrder(this),
    inOrder: () => this._inOrder(this),
    _inOrder: tree => {
      if (tree === null) { return []; }
      return [...this._inOrder(tree.left), tree.data, ...this._inOrder(tree.right)];
    },
    preOrder: () => this._preOrder(this),
    _preOrder: tree => {
      if (tree === null) { return []; }
      return [tree.data, ...this._preOrder(tree.left), ...this._preOrder(tree.right)];
    },
    postOrder: () => this._postOrder(this),
    _postOrder: tree => {
      if (tree === null) { return []; }
      return [...this._postOrder(tree.left), ...this._postOrder(tree.right), tree.data];
    },

    push: data => {
      this._push(data);
      let swap = this._balance();
      if (this.data !== swap.data) { this._swap(swap); }
      return this;
    },
    _push: data => {
      if (this.data === null) { this.data = data; return this; }
      if (this.compare(data, this.data) === -1) {
        if (this.left === null) { this.left = new Tree(data, this.compare); this.left.root = this; }
        else { this.left._push(data); }
      } else if (this.compare(data, this.data) === 1) {
        if (this.right === null) { this.right = new Tree(data, this.compare); this.right.root = this; }
        else { this.right._push(data); }
      } else { return this; }
      return this;
    },

    pop: data => {
      let success = this._pop(data);
      let swap = this._balance();
      if (this.data !== swap.data) { this._swap(swap); }
      return success;
    },
    _pop: data => {
      if (this.data === data) {
        if (this.left === null ) {
          if (this.right === null) {
            if (this.root === null) { this.data = null; }
            else {
              this.root.left === this ? this.root.left = null : this.root.right = null;
              this.root = null;
            }
          } else {
            this.data = this.right.data;
            if (this.right.left !== null) { this.right.left.root = this; }
            if (this.right.right !== null) { this.right.right.root = this; }
            this.left = this.right.left; this.right = this.right.right;
          }
        } else if (this.right === null) {
          this.data = this.left.data;
          if (this.left.left !== null) { this.left.left.root = this; }
          if (this.left.right !== null) { this.left.right.root = this; }
          this.right = this.left.right; this.left = this.left.left;
        } else {
          let leftest = this.right;
          while (leftest.left !== null) { leftest = leftest.left; }
          this.data = leftest.data;
          if (leftest.right !== null) {
            leftest.root.left = leftest.right;
            leftest.right.root = leftest.root;
            leftest.right = null;
          } else {
            leftest.root.left = null;
          }
          leftest.root = null;
        }
        return true;
      } else if (this.data > data) {
        if (this.left !== null) { return this.left._pop(data); }
      } else {
        if (this.right !== null) { return this.right._pop(data); }
      }
      return false;
    },

    update: (oldData, newData) => {
      if (this.pop(oldData)) {
        this.push(newData);
        return true;
      } else { return false; }
    },

    _leftTreeHeight: () => this.left !== null ? Math.max(this.left._leftTreeHeight(), this.left._rightTreeHeight()) + 1 : 0,
    _rightTreeHeight: () => this.right !== null ? Math.max(this.right._leftTreeHeight(), this.right._rightTreeHeight()) + 1 : 0,
    _calcWeight: () => this._leftTreeHeight() - this._rightTreeHeight(),
    _rotateRight: () => {
      let left = this.left;
      left.root = this.root;
      if (this.root !== null) { this.root.left === this ? this.root.left = left : this.root.right = left; }
      this.root = left;
      this.left = left.right;
      left.right = this;
      return left;
    },
    _rotateLeft: () => {
      let right = this.right;
      right.root = this.root;
      if (this.root !== null) { this.root.left === this ? this.root.left = right : this.root.right = right; }
      this.root = right;
      this.right = right.left;
      right.left = this;
      return right;
    },
    _rotateLeftRight: () => {this.left._rotateLeft(); return this._rotateRight();},
    _rotateRightLeft: () => {this.right._rotateRight(); return this._rotateLeft();},
    _balance: () => {
      let weight = this._calcWeight();
      let tree = this;
      if (weight > 1) {
        let subWeight = this.left._calcWeight();
        if (subWeight > 0) { tree = this._rotateRight(); }
        else if (subWeight < 0) { tree = this._rotateLeftRight(); }
      } else if (weight < -1) {
        let subWeight = this.right._calcWeight();
        if (subWeight < 0) { tree = this._rotateLeft(); }
        else if (subWeight > 0) { tree = this._rotateRightLeft(); }
      }
      [] = [];
      return tree.root === null ? tree : tree.root._balance();
    }
  };
};

Array.prototype.toTree = function(compare = null) {
  let tree = new Tree(null, compare);
  this.forEach(elem => tree.push(elem));
  return tree;
};

if (typeof module !== 'undefined') { module.exports = Tree; }
