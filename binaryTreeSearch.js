function Node(data) {
  return {
    data,
    type: typeof data,
    left: null,
    right: null,
  };
}

class Tree {
  constructor(arr) {
    this.array = arr;
    this.sortedArray = this.sortInputArr(this.array);
    this.root = this.buildTree(
      this.sortedArray,
      0,
      this.sortedArray.length - 1
    );
  }

  sortInputArr(arr) {
    const noDuplicatesArr = arr.filter((value, i) => arr.indexOf(value) === i);
    return this.mergeSort(noDuplicatesArr);
  }

  buildTree(arr, start, end) {
    const mid = Math.floor((start + end) / 2);

    if (start > end) return null;
    const root = new Node(arr[mid]);
    root.left = this.buildTree(arr, start, mid - 1);
    root.right = this.buildTree(arr, mid + 1, end);

    return root;
  }

  insert(value) {
    let currentNode = this.root;
    const newNode = new Node(value);

    while (currentNode !== null) {
      if (value === currentNode.data) {
        console.log('The new value is already in the tree');
        return;
      }
      if (value > currentNode.data) {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          return;
        }
        currentNode = currentNode.right;
      }
      if (value < currentNode.data) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          return;
        }
        currentNode = currentNode.left;
      }
    }
  }

  delete(value) {
    let prevNode = null;
    let currentNode = this.root;
    let lastStep = null;

    function findNextBiggestNode() {
      const currentNodeLocal = currentNode;
      let nextNodeToRight = currentNodeLocal.right;
      while (nextNodeToRight !== null) {
        if (nextNodeToRight.left !== null) return nextNodeToRight.left;
        if (nextNodeToRight.left === null) return nextNodeToRight;
        if (nextNodeToRight.right === null) return nextNodeToRight;
        nextNodeToRight = nextNodeToRight.right;
      }
      return null;
    }

    while (currentNode !== null) {
      if (value === currentNode.data) {
        if (currentNode.left === null && currentNode.right === null) {
          if (lastStep === 'left') {
            prevNode.left = null;
            return;
          }
          prevNode.right = null;
          return;
        }

        if (
          (currentNode.left === null && currentNode.right !== null) ||
          (currentNode.left !== null && currentNode.right === null)
        ) {
          if (lastStep === 'left') {
            prevNode.left = currentNode.left;
            return;
          }
          prevNode.right = currentNode.right;
          return;
        }

        // * Node to delete has two children
        if (currentNode.left !== null && currentNode.right !== null) {
          // * find next biggest node
          const nextBiggestNode = findNextBiggestNode();
          // * Assign the children
          nextBiggestNode.left = currentNode.left;
          if (nextBiggestNode !== currentNode.right) {
            nextBiggestNode.right = currentNode.right;
            currentNode.right = null;
          } // * Assign the new node as child of prevNode
          currentNode.right = null;
          currentNode.left = null;
          if (prevNode === null) {
            this.root = nextBiggestNode;
            return;
          }
          if (lastStep === 'left') {
            prevNode.left = nextBiggestNode;
            return;
          }
          prevNode.right = nextBiggestNode;
          return;
        }
      }

      if (value > currentNode.data) {
        prevNode = currentNode;
        currentNode = currentNode.right;
        lastStep = 'right';
      }
      if (value < currentNode.data) {
        prevNode = currentNode;
        currentNode = currentNode.left;
        lastStep = 'left';
      }
    }
  }

  mergeSort(arr) {
    //  * Return if only 1 element
    if (arr.length < 2) return arr;

    // * Split input array
    const halfway = Math.floor(arr.length / 2);
    const firstHalf = arr.slice(0, halfway);
    const secondHalf = arr.slice(halfway);

    const sortedFirstHalf = this.mergeSort(firstHalf);
    const sortedSecondHalf = this.mergeSort(secondHalf);

    return mergeSortedArraysRecursion(sortedFirstHalf, sortedSecondHalf);

    function mergeSortedArraysRecursion(arr1, arr2, sortedArr = []) {
      if (arr1[0] < arr2[0]) {
        sortedArr.push(arr1[0]);
        arr1.shift();
        mergeSortedArraysRecursion(arr1, arr2, sortedArr);
      }
      if (arr1[0] > arr2[0]) {
        sortedArr.push(arr2[0]);
        arr2.shift();
        mergeSortedArraysRecursion(arr1, arr2, sortedArr);
      }
      if (arr1.length !== 0) {
        sortedArr.push(arr1[0]);
        arr1.shift();
      }
      if (arr2.length !== 0) {
        sortedArr.push(arr2[0]);
        arr2.shift();
      }
      return sortedArr;
    }
  }

  find(value) {
    let currentNode = this.root;

    while (currentNode !== null) {
      if (value === currentNode.data) return currentNode;
      if (value > currentNode.data) {
        currentNode = currentNode.right;
      }
      if (value < currentNode.data) {
        currentNode = currentNode.left;
      }
    }
  }

  levelOrderIter(arg) {
    const queue = [this.root];
    const nodeArr = [];

    function queueTraversal() {
      if (queue[0].left !== null) queue.push(queue[0].left);
      if (queue[0].right !== null) queue.push(queue[0].right);
      queue.shift();
    }

    while (queue.length !== 0) {
      if (arg) {
        arg.call(this, queue[0]);
        queueTraversal();
      } else {
        nodeArr.push(queue[0]);
        queueTraversal();
      }
    }
    if (nodeArr.length !== 0) return nodeArr;
  }

  levelOrderRec(arg, node = this.root) {
    const nodeArr = [];
    const queue = [this.root];
    if (queue[0] === null) return null;

    // function queueTraversal() {
    //   if (node.left !== null) levelOrderRec(arg, node.left);
    //   if (node[0].right !== null) levelOrderRec(arg, node.right);
    // }

    if (arg) {
      arg.call(this, node);
      if (node.left !== null) this.levelOrderRec(arg, node.left);
      if (node.right !== null) this.levelOrderRec(arg, node.right);
    } else {
      nodeArr.push(node.data);
      if (node.left !== null) this.levelOrderRec(arg, node.left);
      if (node.right !== null) this.levelOrderRec(arg, node.right);
    }
    if (nodeArr.length !== 0) return nodeArr;
  }

  inorder(arg, node = this.root, nodeArr = []) {
    if (node === null) return;

    if (arg) {
      if (node.left !== null) this.inorder(arg, node.left, nodeArr);
      arg.call(this, node);
      if (node.right !== null) this.inorder(arg, node.right, nodeArr);
    } else {
      if (node.left !== null) this.inorder(arg, node.left, nodeArr);
      nodeArr.push(node);
      if (node.right !== null) this.inorder(arg, node.right, nodeArr);
    }

    if (nodeArr.length !== 0) return nodeArr;
  }

  preorder(arg, node = this.root, nodeArr = []) {
    if (node === null) return;

    if (arg) {
      arg.call(this, node);
      if (node.left !== null) this.preorder(arg, node.left, nodeArr);
      if (node.right !== null) this.preorder(arg, node.right, nodeArr);
    } else {
      nodeArr.push(node);
      if (node.left !== null) this.preorder(arg, node.left, nodeArr);
      if (node.right !== null) this.preorder(arg, node.right, nodeArr);
    }

    if (nodeArr.length !== 0) return nodeArr;
  }

  postorder(arg, node = this.root, nodeArr = []) {
    if (node === null) return;

    if (arg) {
      if (node.left !== null) this.postorder(arg, node.left, nodeArr);
      if (node.right !== null) this.postorder(arg, node.right, nodeArr);
      arg.call(this, node);
    } else {
      if (node.left !== null) this.postorder(arg, node.left, nodeArr);
      if (node.right !== null) this.postorder(arg, node.right, nodeArr);
      nodeArr.push(node);
    }

    if (nodeArr.length !== 0) return nodeArr;
  }

  height(node = this.root) {
    if (node === null) return 0;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(value, node = this.root) {
    const nodeToReach = this.find(value);
    let currentNode = node;
    let currentDepth = 0;

    while (currentNode !== nodeToReach) {
      if (nodeToReach.data === currentNode.data) return currentDepth;
      if (nodeToReach.data > currentNode.data) {
        currentDepth += 1;
        currentNode = currentNode.right;
      }
      if (value < currentNode.data) {
        currentDepth += 1;
        currentNode = currentNode.left;
      }
    }
    return currentDepth;
  }

  isBalanced(node = this.root) {
    return !(Math.abs(this.height(node.left) - this.height(node.right)) > 1);
  }

  rebalance() {
    if (!this.isBalanced()) {
      const arr = this.inorder().map((node) => node.data);
      this.root = null;
      this.root = this.buildTree(arr, 0, arr.length - 1);
    }
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

// ! Test code
function createRandomArr(iterNum, maxValue) {
  const numArr = [];
  for (let i = 1; i <= iterNum; i += 1) {
    numArr.push(Math.floor(Math.random() * maxValue) + 1);
  }
  return numArr;
}
const balancedBinarySearchTree = new Tree(createRandomArr(25, 100));
prettyPrint(balancedBinarySearchTree.root);

console.log(balancedBinarySearchTree.isBalanced());

console.log(balancedBinarySearchTree.levelOrderIter().map((node) => node.data));
console.log(balancedBinarySearchTree.inorder().map((node) => node.data));
console.log(balancedBinarySearchTree.preorder().map((node) => node.data));
console.log(balancedBinarySearchTree.postorder().map((node) => node.data));

balancedBinarySearchTree.insert(110);
balancedBinarySearchTree.insert(150);
balancedBinarySearchTree.insert(170);
balancedBinarySearchTree.insert(130);
balancedBinarySearchTree.insert(190);

prettyPrint(balancedBinarySearchTree.root);
console.log(balancedBinarySearchTree.isBalanced());
balancedBinarySearchTree.rebalance();
console.log(balancedBinarySearchTree.isBalanced());

prettyPrint(balancedBinarySearchTree.root);
console.log(balancedBinarySearchTree.levelOrderIter().map((node) => node.data));
console.log(balancedBinarySearchTree.inorder().map((node) => node.data));
console.log(balancedBinarySearchTree.preorder().map((node) => node.data));
console.log(balancedBinarySearchTree.postorder().map((node) => node.data));
