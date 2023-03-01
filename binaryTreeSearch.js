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
            console.log({ prevnodeNULL: prevNode });
            this.root = nextBiggestNode;
            return;
          }
          if (lastStep === 'left') {
            prevNode.left = nextBiggestNode;
            return;
          }
          console.log({ prevNode, nextBiggestNode });
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
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 9, 7, 67, 6345, 324];
// const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const testTree = new Tree(testArr);

prettyPrint(testTree.root);

testTree.delete(67);
console.log({ testTree: testArr.root, right: testTree.right });
