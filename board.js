//g cost = distance from starting node
//h cost(heuristic) = distance from end node
//f cost = g cost + h cost
class Node {
  constructor(
    value,
    xcoord,
    ycoord,
    gcost,
    hcost,
    fcost,
    neighbors,
    walkable,
    parent
  ) {
    this.value = value;
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.gcost = gcost;
    this.hcost = hcost;
    this.fcost = fcost;
    this.neighbors = neighbors;
    this.walkable = walkable;
    this.parent = parent;
  }
}

var colors = {
  black: {
    hex: "#000000",
    rgb: "rgb(0, 0, 0)"
  },
  white: {
    hex: "#FFFFFF",
    rgb: "rgb(255, 255, 255)"
  },
  blue: {
    hex: "#0000FF",
    rgb: "rgb(0, 0, 255)"
  },
  purple: {
    hex: "#800080",
    rgb: "rgb(128, 0, 128)"
  },
  green: "#008000",
  olive: "#bab86c",
  red: "#FF0000"
};

var grid = Array(10);
//initialize grid, gcost and hcost are 0 until start and endpoint are selected
var count = 1;
for (var i = 0; i < grid.length; i++) {
  grid[i] = [];
  for (var j = 0; j < grid.length; j++) {
    grid[i][j] = new Node(count++, i, j, 0, 0, 0, [], true);
  }
}

var tdlist = document.getElementsByTagName("td");

for (var i = 0; i < tdlist.length; i++) {
  tdlist[i].textContent = i + 1 + "";
}

var index = 0;
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    tdlist[index].setAttribute("id", i + "," + j);
    index++;
  }
}

var startnode, endnode;
var startPlaced = false;
var endPlaced = false;

function changeColor(tdObj) {
  var coords = getCoords(tdObj);
  if (document.getElementById("start").checked == true) {
    //blue, startnode
    if (startPlaced == false) {
      tdObj.style.background = colors.blue.hex;
      startPlaced = true;
      startnode = grid[coords[0]][coords[1]];
      startnode.gcost = startnode.hcost = startnode.fcost = 0;
      console.log(startnode);
    }
  }
  if (document.getElementById("end").checked == true) {
    if (endPlaced == false) {
      tdObj.style.background = colors.purple.hex;
      endPlaced = true;
      var coords = getCoords(tdObj);
      endnode = grid[coords[0]][coords[1]];
      endnode.gcost = endnode.hcost = endnode.fcost = 0;
      console.log(endnode);
    }
  }
  if (document.getElementById("wall").checked == true) {
    //tile is already black(a wall)
    if (tdObj.style.background === colors.black.rgb) {
      tdObj.style.background = colors.white.hex;
      grid[coords[0]][coords[1]].walkable = true;
    }
    //tile is currently a start node (blue)
    else if (tdObj.style.background === colors.blue.rgb) {
      startPlaced = false;
      tdObj.style.background = colors.black.hex;
    }
    //tile is currently an end node (purple)
    else if (tdObj.style.background === colors.purple.rgb) {
      endPlaced = false;
      tdObj.style.background = colors.black.hex;
    } else {
      tdObj.style.background = colors.black.hex;
      grid[coords[0]][coords[1]].walkable = false;
    }
  }

  if (startPlaced && endPlaced) {
    setCosts(startnode, endnode);
  }
}

//assign gcost and hcost to each node based on start and end point
function setCosts(startnode, endnode) {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid.length; j++) {
      var g = Math.abs(i - startnode.xcoord) + Math.abs(j - startnode.ycoord);
      var h = Math.abs(i - endnode.xcoord) + Math.abs(j - endnode.ycoord); //manhattan distance
      var f = g + h;
      grid[i][j].gcost = g;
      grid[i][j].hcost = h;
      grid[i][j].fcost = f;
      grid[i][j].neighbors = getNeighbors(grid, i, j);
    }
  }
}

//color tile whenever its added to the explored list
function colorExplored(explored, current){
  if(explored[explored.length-1] !== startnode && explored[explored.length-1] !== endnode ){
    tdlist[current.value-1].style.background = colors.green;
  }
}

//color tile whenever its added to the open list
function colorOpen(open, index, current){
  if(open[open.length-1] !== startnode && open[open.length-1] !== endnode ){
    tdlist[current.neighbors[index].value-1].style.background = colors.olive;
  }
}

//color all tiles of final path taken
function endPath(path){
  console.log("path taken to endpoint: ");
      console.log(path);
      for (var i = 1; i < path.length - 1; i++) {
        console.log(tdlist[path[i] - 1]);
        tdlist[path[i] - 1].style.background = colors.red;
      }
}

function getCoords(tile) {
  var coords = [];
  var x = tile.id.slice(0, 1);
  coords.push(x);
  var y = tile.id.slice(2, 3);
  coords.push(y);

  return coords;
}

//return neighboring nodes of grid[i][j]
//god help my soul
function getNeighbors(grid, i, j) {
  var n = [];

  if (i > 0) {
    if (j > 0) {
      n.push(grid[i - 1][j - 1]); //top left diagonal
      n.push(grid[i - 1][j]); //top middle
      n.push(grid[i][j - 1]); //middle left

      if (j == grid.length - 1 && i < grid.length - 1) {
        n.push(grid[i + 1][j]);
      }
    } else {
      if (j == 0) {
        n.push(grid[i - 1][j]); //top middle
      }
    }
  } else {
    if (j != 0) {
      n.push(grid[i][j - 1]); //middle left
      if (j == grid.length - 1) {
        n.push(grid[i + 1][j]);
      }
    }
  }

  if (i < grid.length - 1) {
    if (j < grid.length - 1) {
      n.push(grid[i + 1][j]); //bottom middle
      n.push(grid[i + 1][j + 1]); //bottom right diagonal
      n.push(grid[i][j + 1]); //middle right
    }
  } else {
    if (i == grid.length - 1 && j < grid.length - 1) {
      n.push(grid[i][j + 1]); //middle right
    }
  }

  if (i > 0 && j < grid.length - 1) {
    n.push(grid[i - 1][j + 1]); //top right diagonal
  }

  if (j > 0 && i < grid.length - 1) {
    n.push(grid[i + 1][j - 1]); //bottom left diagonal
  }

  return n;
}
