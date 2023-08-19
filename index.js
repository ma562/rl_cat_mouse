const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const VELOCITY = 40;
let gameOver = false;		//checks if the game is over
let myCats = [];      //an array of cats
// let update_iteration = 0;
// let update_every = 500; 
//level 0 - sleep speed, level 1 - walk speed, level 2 jog speed, level 3 run speed
// let my_speeds = [[0.5, 0.75, 1, 1.25, 1.5], [2, 2.25, 2.5], [3, 3.25, 3.5], [4, 4.25, 4.5]]  
let my_speeds = [[0.5], [1.5], [2.5], [3.5]]
let update_every = [[1500, 2500, 3200, 4000], [1000, 2000, 3000, 4000], [1800, 2800, 3800, 4800]];
let UPDATE_EVERY = 10;

const currentScore = parseInt(localStorage.getItem('currentScore'));

// Determine the value of numCats based on the conditions
let numCats = 1;


//MOUSE REINFORCEMENT LEARNING
let EPSILON = 0.9;
const EPS_DECAY = 0.9998;
const DISCOUNT = 0.95;

// Declare numCats as a global variable
window.numCats = numCats;

const mapCollection = {
  map1: [
    // Map 1 original map
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', ' ', ' ','-', ' ', ' ', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', '-', '-', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', '-', '-', '-','-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', ' ', '-', '-', '-', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', ' ', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map2: [
  	// Map 2 three straight lines
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ','-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', '-', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map3: [
  	// Map 3 zig zag 
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ',' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map4: [
  	// Map 4 double horizontal zig zag
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', ' ', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-','-', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ','-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', '-', ' ',' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
			 ['-', ' ', '-', '-', '-', '-','-', ' ', '-', '-', '-', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
  map5: [
    // Map 5 modified double vertical zig zag
    ['-', '-', ' ', ' ', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', ' ', '-', '-', ' ', ' ','-', '-', '-', ' ', ' ', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-',' ', '-', ' ', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', ' ', '-', '-','-', '-', '-', '-', '-', ' ', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', '-', ' ', ' ',' ', ' ', '-', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-',' ', ' ', ' ', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-'],
       ['-', ' ', ' ', ' ', '-', '-','-', '-', '-', '-', '-', ' ', ' ', ' ', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', ' ', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', ' ', '-'],
       ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
       ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
  ],
};

function get_discrete_X(position_x) {
  return parseInt((position_x - startingX + 1) / (Boundary.width));   // + 1 is to fix a rounding error
}

function get_discrete_Y(position_y) {
  return parseInt((position_y - startingY + 1) / (Boundary.height));  // + 1 is to fix a rounding error
}

function get_continuous_X(position_x) {
  return position_x * Boundary.width + startingY;
}

function get_continuous_Y(position_y) {
  return position_y * Boundary.height + startingX;
}

// Function to get a random map key that hasn't been used yet
function getRandomUnusedMapKey() {
  const mapKeys = Object.keys(mapCollection);
  const usedMapKeys = JSON.parse(localStorage.getItem('usedMapKeys')) || [];

  // Filter out the used map keys
  const availableMapKeys = mapKeys.filter(key => !usedMapKeys.includes(key));

  if (availableMapKeys.length === 0) {
    // If all maps have been used once, reset the usedMapKeys to start reusing maps
    localStorage.removeItem('usedMapKeys');
    return getRandomUnusedMapKey();
  }

  const randomIndex = Math.floor(Math.random() * availableMapKeys.length);
  return availableMapKeys[randomIndex];
}

// Function to get the map for the given key and mark it as used
function getMapAndMarkUsed(mapKey) {
  const map = mapCollection[mapKey];
  let usedMapKeys = JSON.parse(localStorage.getItem('usedMapKeys')) || [];
  usedMapKeys.push(mapKey);

  // If all maps have been used once, reset the usedMapKeys to start reusing maps
  if (usedMapKeys.length === Object.keys(mapCollection).length) {
    usedMapKeys = [];
    localStorage.removeItem('usedMapKeys'); // Clear the storage for reuse
  }

  localStorage.setItem('usedMapKeys', JSON.stringify(usedMapKeys));
  return map;
}

let map;
// Usage:
const randomMapKey = getRandomUnusedMapKey();

if (randomMapKey) {
  map = getMapAndMarkUsed(randomMapKey);
} else {
  // Handle the case where all maps have been used once and start reusing maps
  const reusedMapKey = getRandomUnusedMapKey();
  if (reusedMapKey) {
    map = getMapAndMarkUsed(reusedMapKey);
  } else {
    console.log('All maps have been used once. Starting to reuse maps.');
  }
}

function playerCollides(inputArray, row, col) {

    const innerBox = [];
    for (let i = 1; i < 14; i++) {
        innerBox.push(inputArray[i].slice(1, 14));
    }

    if (row < 0 || row >= innerBox.length || col < 0 || col >= innerBox[0].length) {
        return true;
    }

    return innerBox[row][col] === '-';
}

// console.log(extractInnerBox(map));

// Initialize Q-table
  const qTable = {};
  for (let i = - + 1; i < (map.length - 2); i++) {
    for (let ii = -(map.length - 2) + 1; ii < (map.length - 2); ii++) {
      for (let iii = -(map.length - 2) + 1; iii < (map.length - 2); iii++) {
        for (let iiii = -(map.length - 2) + 1; iiii < (map.length - 2); iiii++) {
          qTable[`${i}_${ii}_${iii}_${iiii}`] = [
            Math.random() * -5,
            Math.random() * -5,
            Math.random() * -5,
            Math.random() * -5,
          ];
        }
      }
    }
  }

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper function to get the index of the parent of a node
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Helper function to get the index of the left child of a node
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Helper function to get the index of the right child of a node
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Helper function to swap two elements in the heap
  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  clear() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  // Helper function to bubble up the element at the given index
  bubbleUp(index) {
    // If the current node is the root (index 0), no need to bubble up further
    if (index === 0) return;

    const parentIndex = this.getParentIndex(index);

    // If the current node has higher priority (smaller s_d) than its parent, swap them and continue bubbling up
    if (this.heap[index].s_d < this.heap[parentIndex].s_d) {
      this.swap(index, parentIndex);
      this.bubbleUp(parentIndex);
    }
  }

  // Helper function to bubble down the element at the given index
  bubbleDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let highestPriorityIndex = index;

    // Find the node with the highest priority (smallest s_d) among the current node and its two children
    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].s_d < this.heap[highestPriorityIndex].s_d
    ) {
      highestPriorityIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].s_d < this.heap[highestPriorityIndex].s_d
    ) {
      highestPriorityIndex = rightChildIndex;
    }

    // If the node with the highest priority is not the current node, swap them and continue bubbling down
    if (highestPriorityIndex !== index) {
      this.swap(index, highestPriorityIndex);
      this.bubbleDown(highestPriorityIndex);
    }
  }

  // Insert a new node into the priority queue
  insert(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  // Remove and return the node with the highest priority (smallest s_d) from the priority queue
  extractMin() {
    if (this.heap.length === 0) return null;

    // If there is only one node, remove and return it
    if (this.heap.length === 1) return this.heap.pop();

    // Otherwise, remove the node with the highest priority (root), replace it with the last node,
    // and then bubble down the new root to its correct position
    const minNode = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return minNode;
  }
}

const pq = new PriorityQueue();

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Boundary {
	static width = 40
	static height = 40
	constructor({ position }) {
		this.position = position
		this.width = 40
		this.height = 40
	}

	draw() {
		//c.drawImage(this.image, this.position.x, this.position.y)
		if(get_discrete_X(this.position.x) < 0 || 
			get_discrete_Y(this.position.y) < 0 ||
			get_discrete_X(this.position.x) > map.length - 4 ||
			get_discrete_Y(this.position.y) > map[0].length - 4
			) {
      if((get_discrete_X(this.position.x) === map.length || get_discrete_X(this.position.x) === map.length) &&
      (get_discrete_Y(this.position.y) > map[0].length - 4)) {
        c.fillStyle = 'transparent';
      }
      else {
        c.fillStyle = 'green'
      }
			
		}
		else {
			c.fillStyle = 'black'
		}
		
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    this.image.src = 'mouse3.png';
    this.movement_in_progress = false;
    this.future_row = -1;
    this.future_col = -1;
    this.blockage = false;
      //this used to be 18 so used the adjustment factor of 18 - this.radius when calculating fastest times
    this.radius = 18; // Adjust the radius of the player image
    this.my_velocity = VELOCITY;
    this.speed_level = 0;
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

  mouse_is_not_scared() {
    this.image.src = 'mouse3.png';
  }

	update() {
		this.draw()
		//no going horizontal
		if(this.velocity.x != 0) {
			this.position.x += this.velocity.x 
		}
		else {
			this.position.y += this.velocity.y
		}
	}

  updateMouseImage() {
  	this.image.src = "mouse3.png";
  }

  action(choice) {
    if (choice === 0) {
      //W
      this.future_row = get_discrete_Y(this.position.y) - 1;
      this.future_col = get_discrete_X(this.position.x);
    } else if (choice === 1) {
      //A
      this.future_row = get_discrete_Y(this.position.y);
      this.future_col = get_discrete_X(this.position.x) - 1;
    } else if (choice === 2) {
      //S
      this.future_row = get_discrete_Y(this.position.y) + 1;
      this.future_col = get_discrete_X(this.position.x);
    } else if (choice === 3) {
      //D
      this.future_row = get_discrete_Y(this.position.y);
      this.future_col = get_discrete_X(this.position.x) + 1;
    }
  }

}



class Cat {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    this.image.src = 'cat3.png';
    this.radius = 18; // Adjust the radius of the player image
    this.go_flag = false;
    this.speed = 40;
    this.speed_level = -1;
    this.movement_in_progress = false;
    // this.update_iteration = 0;
    this.path_iterations = 0;
    this.rows = [];
    this.col = [];
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

  updateNormalCat() {
    this.image.src = "cat3.png";
  }

  updateCatImage() {
  	this.image.src = "cat3.png";
  }

	update() {
		this.draw()
		this.position.x += this.velocity.x 
		this.position.y += this.velocity.y
	}
}

const boundaries = []

const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

let lastKey = ''

const mapWidth = map[0].length * Boundary.width;		//number of columns
const mapHeight = map.length * Boundary.height;			//number of rows


//DIJKSTRA'S ALGORITHM
// Define the Node object
class Node {
  constructor() {
    this.value = 0;
    this.coordinate_x = 0;
    this.coordinate_y = 0;
    this.prev_row = 0;
    this.prev_col = 0;
    this.visited = 0; // BOOL TO INT
    this.s_d = 0;
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.next = null; // for writing to fastest times
  }
}

function read_write_values(wall_mat) {
	//This function codes in the path lengths of the map
	const num_columns = map[0].length - 2
  const num_rows = map.length - 2
  const array = new Array(num_columns * num_rows); // create matrix of tiles

  let k = 0;
  // // 0th ROW IS WALL-LESS
  for(let i = 0; i < map.length; i++) {
  	if(i === 0 || i === (map.length - 1)) {
  			//don't account for border walls
  			continue;
  	}

  	for(let j = 0; j < map[0].length; j++) {
  		if(j === 0 || j === (map[0].length - 1)) {
  			//don't account for border walls
  			continue;
  		}
  		if(wall_mat[i][j] === '-') {
  			//we have a wall
  			array[k] = num_columns * num_rows
  		}
  		else {
  			//we have a path
  			array[k] = 1
  		}
  		k++;
  	}
  }
  return array;
}

function relax_node(node) {
  let key_return = null; // The next node with the shortest distance to explore

  if (node.north !== null) {
    const north_node = node.north;

    if (node.s_d + north_node.value < north_node.s_d) {
      north_node.s_d = node.s_d + north_node.value;
      north_node.prev_row = node.coordinate_x;
      north_node.prev_col = node.coordinate_y;

    }
    if(!north_node.visited) {
      pq.insert(north_node);
    }
    
  }

  if (node.west !== null) {
    const west_node = node.west;

    if (node.s_d + west_node.value < west_node.s_d) {
      west_node.s_d = node.s_d + west_node.value;
      west_node.prev_row = node.coordinate_x;
      west_node.prev_col = node.coordinate_y;
    }
    if(!west_node.visited) {
      pq.insert(west_node);
    }
  }

  if (node.east !== null) {
    const east_node = node.east;

    if (node.s_d + east_node.value < east_node.s_d) {
      east_node.s_d = node.s_d + east_node.value;
      east_node.prev_row = node.coordinate_x;
      east_node.prev_col = node.coordinate_y;
    }

    if(!east_node.visited) {
      pq.insert(east_node);
    }
  }

  if (node.south !== null) {
    const south_node = node.south;

    if (node.s_d + south_node.value < south_node.s_d) {
      south_node.s_d = node.s_d + south_node.value;
      south_node.prev_row = node.coordinate_x;
      south_node.prev_col = node.coordinate_y;
    }

    if(!south_node.visited) {
      pq.insert(south_node);
    }
  }

  node.visited = 1; // 1 instead of true
}

function grab_path(matrix, c_r, c_c, m_r, m_c, path_row, path_col) {
  let ctr = 0;
  // console.log(matrix);

  while (c_r !== m_r || c_c !== m_c) {
    let val = matrix[c_r][c_c];
    c_r = val.prev_row;
    c_c = val.prev_col;
    path_row[ctr] = c_r;
    path_col[ctr] = c_c;

    ctr++;
  }
  // Prevent loose ends of the array
  path_row[ctr] = -1;
  path_col[ctr] = -1;
}

function fastestTimes(values, cat_r, cat_c, mouse_r, mouse_c, row_path, col_path) {
	//clear previous values of the paths
	row_path.length = 0;
	col_path.length = 0;		

	const rows = (map.length - 2);
	const columns = (map[0].length - 2);
	const matrix = [];
	let k = 0;

	for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < columns; j++) {
      const node = {
        value: values[k],
        coordinate_x: i,
        coordinate_y: j,
        prev_row: 0,
        prev_col: 0,
        visited: 0,
        s_d: 32767,
        north: null,
        south: null,
        east: null,
        west: null,
        next: null,
      };
      matrix[i][j] = node;
      k++;
    }
  }

  // Connect neighboring nodes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i === 0) {
        // First row
        matrix[i][j].north = null;
      } else {
        matrix[i][j].north = matrix[i - 1][j];
      }
      if (j === 0) {
        // First column
        matrix[i][j].west = null;
      } else {
        matrix[i][j].west = matrix[i][j - 1];
      }
      if (i === rows - 1) {
        // Last row
        matrix[i][j].south = null;
      } else {
        matrix[i][j].south = matrix[i + 1][j];
      }
      if (j === columns - 1) {
        // Last column
        matrix[i][j].east = null;
      } else {
        matrix[i][j].east = matrix[i][j + 1];
      }
    }
  }


  const parent_node = matrix[mouse_r][mouse_c];
  parent_node.s_d = parent_node.value;
  pq.clear();
  pq.insert(parent_node);
  while(!pq.isEmpty()) {
    relax_node(pq.extractMin());
  }
  // console.log(matrix);
  grab_path(matrix, cat_r, cat_c, mouse_r, mouse_c, row_path, col_path);

}

// Calculate offsets to center the map
const offsetX = Math.floor((canvas.width - mapWidth) / 2);
const offsetY = Math.floor((canvas.height - mapHeight) / 2);
const startingX = offsetX + Boundary.width + Boundary.width / 2;
const startingY = offsetY + Boundary.width + Boundary.width / 2

function updateScoreboard(shouldIncreaseScore) {

  // Get the current score from localStorage or initialize it if not present
  let currentScore = parseInt(localStorage.getItem('currentScore')) || 0;

  if (shouldIncreaseScore) {
    // Increase the current score if the player is moving on to the next level
    currentScore++;
  }

  // Get the high score from localStorage or initialize it if not present
  let highScore = parseInt(localStorage.getItem('highScore')) || 0;

  // Update the high score if the current score surpasses it
  if (currentScore > highScore) {
    highScore = currentScore;
    // Save the new high score to localStorage
    localStorage.setItem('highScore', highScore);
  }

  // Save the updated current score to localStorage
  localStorage.setItem('currentScore', currentScore);

  // Display the scores on the scoreboard element
  const scoreboardElement = document.getElementById('scoreboard');
  scoreboardElement.textContent = 'Episode: ' + currentScore + ' - Epsilon: ' + highScore;


  // Get the size of the maze (canvas) and the scoreboard element
  const mazeWidth = canvas.width;
  const scoreboardWidth = scoreboardElement.clientWidth;
  const scoreboardHeight = scoreboardElement.clientHeight;

  // Set the padding from the top and right edges of the maze
  const paddingFromTop = 20;
  const paddingFromRight = 1000;

  // Calculate the top and right positions for the scoreboard
  const scoreboardTop = paddingFromTop;
  const scoreboardRight = mazeWidth - paddingFromRight - scoreboardWidth;

  // Position the scoreboard element
  scoreboardElement.style.position = 'fixed';
  scoreboardElement.style.top = startingY - 120 + 'px';
  // scoreboardElement.style.right = scoreboardRight + 'px';
  scoreboardElement.style.left = startingX + 200 + 'px';
}

//creation of the cats
for(let i = 0; i < numCats; i++) {
  const cat = new Cat({
  position: {
    x: startingX,
    y: startingY
  },
  velocity: {
    x: 0,
    y: 0
  }
})

  myCats.push(cat);
}

const player = new Player({
	position: {
		x: startingX + (Boundary.width * (map[0].length - 4)),
		y: startingY + (Boundary.width * (map.length - 3))
	 },
	 velocity: {
	 	x:0,
	 	y:0
	 }
})

map.forEach((row, i) => {
	row.forEach((symbol, j) => {
		switch (symbol) {
			case '-':
			boundaries.push(
				new Boundary({
					position: {
						 x: offsetX + Boundary.width * j,
              		     y: offsetY + Boundary.height * i
					}
				})
			)
			break
		}
	})
})

function circleCollidesWithRectangle({
	circle,
	rectangle
}) {
	return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height 
			&& circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x 
			&& circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
			&& circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}

let animate_iteration = 0;

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function checkCollision(playerX, playerY, catX, catY) {
  // //CHECK THAT THE PLAYER AND CAT ARE WITHIN ONE BLOCK DISTANCE TO EACH OTHER
  // const collisionDistance = 35; // The collision distance in units

  // // Calculate the distance between the player and cat
  // const distance = calculateDistance(playerX, playerY, catX, catY);

  // // Return true if they are within the collision distance
  // return distance <= collisionDistance;

  const distance = Math.abs(get_discrete_X(playerX) - get_discrete_X(catX)) + Math.abs(get_discrete_Y(playerY) - get_discrete_Y(catY));

  return distance <= 1;
}

async function checkCollisionAndRestart() {
  for(let i = 0; i < myCats.length; i++) {
    if (!gameOver && checkCollision(player.position.x, player.position.y, myCats[i].position.x, myCats[i].position.y)) {
      player.draw();
      myCats[i].draw();
      gameOver = true;
      await delay(1000);
      localStorage.setItem('currentScore', 0);
      console.log("game over LOL");
      updateScoreboard(true);

      
      player.position.x = startingX + (Boundary.width * (map[0].length - 4));
      player.position.y = startingY + (Boundary.width * (map.length - 3))
      player.blockage = true;

      myCats[0].position.x = startingX;
      myCats[0].position.y = startingY;
      
    }
  }
}

function getRandomSpeed(arr) {
    // Generate a random index within the range of the array's length
    const randomIndex = Math.floor(Math.random() * arr.length);

    // Access and return the element at the random index
    return arr[randomIndex];
  }


function animate() {
  gameOver = false;
  checkCollisionAndRestart();
  updateScoreboard(false);

  if(player.position.y < startingY) {
    updateScoreboard(true);
    window.location.reload();
    return;
  }
  
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)

	animate_iteration++;

	boundaries.forEach((boundary) => {
		boundary.draw()
		if (circleCollidesWithRectangle({
			circle: player,
			rectangle: boundary
		})) {
			player.blockage = true;
      console.log("illegal detected");
		}
	})

	player.draw();
  

  function sameRowCol(arr) {
  if (arr.length <= 1) {
    // If the array has only one element or is empty, return false
    return false;
  }


  const lastValue = arr[arr.length - 1];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== arr[0]) {
      // If any element is different from the first value, return false
      return false;
    }
  }

  // If all elements are the same (except for the last one), return true
  return true;
}

  for(let i = 0; i < myCats.length; i++) {
    myCats[i].draw();
  }
  if(playerCollides(map, get_discrete_Y(myCats[0].position.y), get_discrete_X(myCats[0].position.x))) {
    console.log("PROBLEM");
    console.log(myCats[0].rows);
    console.log(myCats[0].col);
  }

	

  if(animate_iteration % UPDATE_EVERY === 0) {
    for(let i = 0; i < myCats.length; i++) {
    if((myCats[i].rows.length !== 0) && (myCats[i].col.length !== 0) && (myCats[i].rows[myCats[i].path_iterations] !== -1) && (myCats[i].col[myCats[i].path_iterations] !== -1)) {
    
    //NOTE EACH CAT NEEDS IT'S OWN FRIGGIN UPDATE ITERATION
    // myCats[i].update_iteration++;
    cat_speed = myCats[i].speed;
    
    let direction_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) - myCats[i].position.y;
    let direction_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) - myCats[i].position.x;

    if (direction_row) {
        direction_row = direction_row > 0 ? 1 : -1;
    } else {
        direction_row = 0;
    }

    if (direction_col) {
        direction_col = direction_col > 0 ? 1 : -1;
    } else {
        direction_col = 0;
    }

    let new_row = myCats[i].position.y + direction_row * cat_speed;
    let new_col = myCats[i].position.x + direction_col * cat_speed;


    if (
    (new_row < get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row > 0) ||
    (new_row > get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row < 0) ||
    (new_col < get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col > 0) ||
    (new_col > get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col < 0)
    ) {
      myCats[i].movement_in_progress = true;
      let go_to_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]);
      let go_to_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]);
      let row_vector = go_to_row - myCats[i].position.y;
      let col_vector = go_to_col - myCats[i].position.x;

      if(row_vector) {
        if(row_vector > 0) {
          myCats[i].position.y += cat_speed;
        }
        else {
          myCats[i].position.y -= cat_speed;
        }
      }
      else if(col_vector) {
        if(col_vector > 0) {
          myCats[i].position.x += cat_speed;
        }
        else {
          myCats[i].position.x -= cat_speed;
        }
      }
    }
    else if(
    (new_row >= get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row > 0) ||
    (new_row <= get_continuous_X(myCats[i].rows[myCats[i].path_iterations]) && direction_row < 0) ||
    (new_col >= get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col > 0) ||
    (new_col <= get_continuous_Y(myCats[i].col[myCats[i].path_iterations]) && direction_col < 0)
    )
    {
      let go_to_row = get_continuous_X(myCats[i].rows[myCats[i].path_iterations]);
      let go_to_col = get_continuous_Y(myCats[i].col[myCats[i].path_iterations]);
      let row_vector = go_to_row - myCats[i].position.y;
      let col_vector = go_to_col - myCats[i].position.x;
      if(row_vector) {
        myCats[i].position.y = go_to_row;
      }
      else if(col_vector) {
        myCats[i].position.x = go_to_col;
      }
      myCats[i].movement_in_progress = false;
      myCats[i].path_iterations++;
    }
    
  }

    if(animate_iteration % UPDATE_EVERY === 0) {
      myCats[i].go_flag = true;
    }

    // if(animate_iteration === 1 || (myCats[i].go_flag && !myCats[i].movement_in_progress)) {
    if(animate_iteration === 1 || (myCats[i].go_flag)) {
    //update CAT

    my_matrix = read_write_values(map)

    fastestTimes(my_matrix, get_discrete_Y(myCats[i].position.y), get_discrete_X(myCats[i].position.x), get_discrete_Y(player.position.y), get_discrete_X(player.position.x), myCats[i].rows, myCats[i].col)
    myCats[i].path_iterations = 0;
    for(let test = 0; test < myCats[i].rows.length - 1; test++) {
      if(playerCollides(map, myCats[i].rows[test], myCats[i].col[test])) {
        console.log("WE HAVE A PROBLEM");
      }
    }

    myCats[i].go_flags = false;    //reset go_flag so we have to wait until the next iteration to update shortest path
  }
  }
  
  const obs = `${get_discrete_X(player.position.x)}_${get_discrete_Y(player.position.y)}_${get_discrete_X(myCats[0].position.x)}_${get_discrete_Y(myCats[0].position.y)}`;

  action = Math.floor(Math.random() * 4);
  // console.log(action);
  player.action(action);

  if(!gameOver && !playerCollides(map, player.future_row, player.future_col)) {
  let direction_row2 = get_continuous_X(player.future_row) - player.position.y;
  let direction_col2 = get_continuous_Y(player.future_col) - player.position.x;

  if (direction_row2) {
      direction_row2 = direction_row2 > 0 ? 1 : -1;
  } else {
      direction_row2 = 0;
  }

  if (direction_col2) {
      direction_col2 = direction_col2 > 0 ? 1 : -1;
  } else {
      direction_col2 = 0;
  }

  let new_row2 = player.position.y + direction_row2 * VELOCITY;
  let new_col2 = player.position.x + direction_col2 * VELOCITY;

  if (
  (new_row2 < get_continuous_X(player.future_row) && direction_row2 > 0) ||
  (new_row2 > get_continuous_X(player.future_row) && direction_row2 < 0) ||
  (new_col2 < get_continuous_Y(player.future_col) && direction_col2 > 0) ||
  (new_col2 > get_continuous_Y(player.future_col) && direction_col2 < 0)
  ) {
    player.movement_in_progress = true;
    let go_to_row2 = get_continuous_X(player.future_row);
    let go_to_col2 = get_continuous_Y(player.future_col);
    let row_vector2 = go_to_row2 - player.position.y;
    let col_vector2 = go_to_col2 - player.position.x;


    if(row_vector2) {
      if(row_vector2 > 0) {
        player.position.y += VELOCITY;
      }
      else {
        player.position.y -= VELOCITY;
      }
    }
    else if(col_vector2) {
      if(col_vector2 > 0) {
        player.position.x += VELOCITY;
      }
      else {
        player.position.x -= VELOCITY;
      }
    }
  }

  else if(
    (new_row2 >= get_continuous_X(player.future_row) && direction_row2 > 0) ||
    (new_row2 <= get_continuous_X(player.future_row) && direction_row2 < 0) ||
    (new_col2 >= get_continuous_Y(player.future_col) && direction_col2 > 0) ||
    (new_col2 <= get_continuous_Y(player.future_col) && direction_col2 < 0)
    )
    {
      let go_to_row2 = get_continuous_X(player.future_row);
      let go_to_col2 = get_continuous_Y(player.future_col);
      let row_vector2 = go_to_row2 - player.position.y;
      let col_vector2 = go_to_col2 - player.position.x;
      if(row_vector2) {
        player.position.y = go_to_row2;
      }
      else if(col_vector2) {
        player.position.x = go_to_col2;
      }
      player.movement_in_progress = false;
    }
  }
  }

  

}

animate()

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}


// window.addEventListener('keydown', ({key}) => {
// 	switch (key) {
// 		case 'w':
// 			keys.w.pressed = true
// 			player.future_row = get_discrete_Y(player.position.y) - 1;
// 			player.future_col = get_discrete_X(player.position.x);
// 			lastKey = 'w'
// 			break
// 		case 'a':
// 			player.future_row = get_discrete_Y(player.position.y);
// 			player.future_col = get_discrete_X(player.position.x) - 1;
// 			keys.a.pressed = true
// 			lastKey = 'a'
// 			break
// 		case 's':
// 			player.future_row = get_discrete_Y(player.position.y) + 1;
// 			player.future_col = get_discrete_X(player.position.x);
// 			keys.s.pressed = true
// 			lastKey = 's'
// 			break
// 		case 'd':
// 			player.future_row = get_discrete_Y(player.position.y);
// 			player.future_col = get_discrete_X(player.position.x) + 1;
// 			keys.d.pressed = true
// 			lastKey = 'd'
// 			break
// 	}
// })

// window.addEventListener('keyup', ({key}) => {
// 	switch (key) {
// 		case 'w':
// 			keys.w.pressed = false
// 			if (lastKey === 'w') {
//         player.velocity.y = 0;
//       }
// 			break
// 		case 'a':
// 			keys.a.pressed = false
// 			if (lastKey === 'a') {
//         player.velocity.x = 0;
//       }
// 			break
// 		case 's':
// 			keys.s.pressed = false
// 			if (lastKey === 's') {
//         player.velocity.y = 0;
//       }
// 			break
// 		case 'd':
// 			keys.d.pressed = false
// 			if (lastKey === 'd') {
//         player.velocity.x = 0;
//       }
// 			break
// 	}
// })



