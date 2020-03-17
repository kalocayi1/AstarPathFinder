function start() {
  //set of nodes to be evaluated
  var open = [];
  //set of nodes that have already been evaluated
  var explored = [];

  console.log(grid);
  //console.log(startnode);
  //console.log(endnode);

  //add start node to open list
  open.push(startnode);

  while (open.length !== 0) {
    //loop through nodes in open and save one with lowest fcost
    var current = open[0];
    var index = 0;
    for (var i = 0; i < open.length; i++) {
      if (open[i].fcost < current.fcost) {
        current = open[i];
        index = i;
      }
    }

    //remove current from open list
    open.splice(index, 1);

    //add current to explored list
    explored.push(current);
    colorExplored(explored, current);
    

    //end node has been found, save path that algorithm took and break the loop
    if (current === endnode) {
      console.log("End node has been found!");
      var path = [];
      var current_node = current;
      while (current_node != undefined) {
        path.push(current_node.value);
        current_node = current_node.parent;
      }
      path.reverse();
      endPath(path);
      break;
    } else {
      //traverse each neighbor of current node
      for (var i = 0; i < current.neighbors.length; i++) {
        //if neighbor is not traversable or has already been explored, skip
        if (
          explored.includes(current.neighbors[i]) ||
          !current.neighbors[i].walkable
        ) {
          continue;
        } else {
          //new path to neighbor is shorter or neighbor is not in open
          if (
            !open.includes(current.neighbors[i]) ||
            current.neighbors[i].fcost <
              open.find(e => e === current.neighbors[i])
          ) {
            //set f_cost of neighbor
            current.neighbors[i].gcost = current.gcost + 1;

            current.neighbors[i].hcost =
              Math.abs(current.neighbors[i].xcoord - endnode.xcoord) +
              Math.abs(current.neighbors[i].ycoord - endnode.ycoord);

            current.neighbors[i].fcost =
              current.neighbors[i].gcost + current.neighbors[i].hcost;

            current.neighbors[i].parent = current;

            //add neighbor to open array if neighbor is not already in it
            if (!open.includes(current.neighbors[i])) {
              open.push(current.neighbors[i]);
              colorOpen(open, i, current);
            }
          }
        }
      }
    }
  }

  //--------------------------------------------------------------------------------------------------------------------------
  //console.log(grid);

  console.log("open list: ");
   console.log(open);

  console.log("explored list: ");
  console.log(explored);
}
