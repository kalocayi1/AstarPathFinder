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
  black: "#000000",
  white: "#FFFFFF",
  blue: "#0000FF",
  purple: "#800080",
  green: "#008000",
  olive: "#bab86c"
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
  if (document.getElementById("start").checked == true) {
    //blue, startnode
    if (startPlaced == false) {
      tdObj.style.background = colors.blue;
      startPlaced = true;
      var x = tdObj.id.slice(0, 1);
      var y = tdObj.id.slice(2, 3);
      startnode = grid[x][y];
      startnode.gcost = startnode.hcost = startnode.fcost = 0;
      //grid[x][y].walkable = false;
      console.log(startnode);
    }
  }
  if (document.getElementById("end").checked == true) {
    if (endPlaced == false) {
      tdObj.style.background = colors.purple;
      endPlaced = true;
      var x = tdObj.id.slice(0, 1);
      var y = tdObj.id.slice(2, 3);
      endnode = grid[x][y];
      endnode.gcost = endnode.hcost = endnode.fcost = 0;
      //grid[x][y].walkable = false;
      console.log(endnode);
    }
  }
  if (document.getElementById("wall").checked == true) {
    //tile is black
    if (tdObj.style.background === "rgb(0, 0, 0)") {
      tdObj.style.background = colors.white;
    }
    //tile is currently a start node (blue)
    else if (tdObj.style.background === "rgb(0, 0, 255)") {
      startPlaced = false;
      tdObj.style.background = colors.black;
    }
    //tile is currently an end node (purple)
    else if (tdObj.style.background === "rgb(128, 0, 128)") {
      endPlaced = false;
      tdObj.style.background = colors.black;
    } else {
      tdObj.style.background = colors.black;
      var x = tdObj.id.slice(0, 1);
      var y = tdObj.id.slice(2, 3);
      grid[x][y].walkable = false;
    }
  }

  if (startPlaced && endPlaced) {
    setCosts(startnode, endnode);
  }
}

function setCosts(startnode, endnode) {
  //assign gcost and hcost to each node based on start and end point
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid.length; j++) {
      //var g = Math.abs(startnode.value - grid[i][j].value);
      var g = Math.abs(i - startnode.xcoord) + Math.abs(j - startnode.ycoord);
      //var h = Math.abs(endnode.value - grid[i][j].value);
      var h = Math.abs(i - endnode.xcoord) + Math.abs(j - endnode.ycoord); //manhattan distance
      var f = g + h;
      grid[i][j].gcost = g;
      grid[i][j].hcost = h;
      grid[i][j].fcost = f;
      grid[i][j].neighbors = getNeighbors(grid, i, j);
    }
  }
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
