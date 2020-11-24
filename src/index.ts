import * as d3 from "d3";
import Graph from "./graph";

const svg = d3
  .select("body")
  .append("div")
  .attr('id', 'graph-container')
  .attr("width", 500)
  .attr("height", 500);

const graph = {
  nodes: [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
    { id: 5, label: "5" },
    { id: 6, label: "6" },
  ],
  links: [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 4, target: 5 },
    { source: 4, target: 1 },
    { source: 6, target: 4 },

  ]
}

const graph1 = new Graph("graph-container");
graph1.load(graph);
graph1.moveGraph(5000);
// graph1.contractEdge("1", "4");
// graph1.changeVerticesColor(["1", "2"], "blue", 3500);
// graph1.changeEdgesColor([["1", "2"], ["1", "3"]], "blue", 1000);
// graph1.changeSizeOfVertices(["1", "2"], 20, 3000);
// graph1.changeSizeOfEdge([["1", "2"]], 8, 1000);
// graph1.generateRandomGraph(20, 20);
// graph1.changeVerticesColor("green", 3000);
// graph1.changeAllEdgesColor("red", 3000);
// graph1.addEdge("1", "2");
// graph1.removeEdge("1", "2");
// graph1.addVertex("3");
// graph1.addVertex("4");
// graph1.changeVertexColor("2", 'blue');
// graph1.changeLabel("2", "yep");
// graph1.changeLabel("1", "hello");
// graph1.addHull(["1", "2", "3"]);
// graph1.addVertex("21");

// TODO:
// color subset vertices
// specify layout
// async 
// hull tube 
// labels pointing to a vertex
// blob label
