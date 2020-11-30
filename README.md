## BetterGraphs
A library for visualizing graph theory concepts.


## How to use
### Step 1 - Import the library
---
Import D3.js
```html
<script src="https://d3js.org/d3.v6.min.js"></script>
```
Import BetterGraphs
```html
<script src="https://unpkg.com/bettergraphs/dist/index.js"></script>
```
### Step 2 - Create a graph object
---
```js
const graph = betterGraphs.graph(divId);
```
Where div is an `id` tag of the HTML `<div></div>` you want to render the graph in.

### Step 3 - Call methods
---
Use the object you declared to call functions.

NOTE: All `animationDuration` arguments are in milliseconds. If you want an animation to take 1 sec pass in `1000`.

<a name="min" href="#load">#</a> graph.<b>load</b>(graph)
```js
// graph.load() example
graph.load(
  {
    nodes: [
      {id: 1, label: "1"},
      {id: 2, label: "2"},
      {id: 3, label: "3"}
    ],
    links: [
      {source: 1, target: 2},
      {source: 1, target: 3}
    ]
  }
)
```

<a name="changeVerticesColoR" href="#changeVerticesColor">#</a> graph.<b>changeVerticesColor</b>(string[], string, number)

First argument is a string array of the vertices you want to color. Second argument is the color you want. Third argument is animation duration.
```js
// changeVerticesColor() example
graph.changeVerticesColor(["1", "2"], "red", 1000);
```

<a name="changeEdgesColor" href="#changeEdgesColor">#</a> graph.<b>changeEdgesColor</b>(string[][], string, number)

First argument is 2d array of strings array of the edges you want to color. Second argument is the color you want. Third argument is animation duration.
```js
// changeEdgesColor() example
graph.changeEdgesColor([["1", "2"], ["1", "3"]], "blue", 1000);
```

<a name="changeSizeOfVertices" href="#changeSizeOfVertices">#</a> graph.<b>changeSizeOfVertices</b>(string[], number)

First argument is a string array of the vertices you want to color. Second argument is the radius you want.
```js
// changeSizeOfVertices() example
graph.changeSizeOfVertices(["1", "2"], 25);
```
<a name="changeSizeOfEdges" href="#changeSizeOfEdges">#</a> graph.<b>changeSizeOfEdges</b>(string[][], number)

First argument is a 2d array of strings containing edges. Second argument is the stroke width.
```js
// changeSizeOfEdges() example
graph.changeSizeOfEdges([["1", "2"], ["1", "3"]], 15);
```
<a name="changeAllVerticesColor" href="#changeAllVerticesColor">#</a> graph.<b>changeAllVerticesColor</b>(string, number)

First argument is the color you want. Second argument is animation duration.
```js
// changeAllVerticesColor() example
graph.changeAllVerticesColor("red", 2500);
```
<a name="changeAllEdgesColor" href="#changeAllEdgesColor">#</a> graph.<b>changeAllEdgesColor</b>(string, number)

First argument is the color you want. Second argument is animation duration.
```js
// changeAllEdgesColor() example
graph.changeAllEdgesColor("pink", 1500);
```
<a name="removeVertex" href="#removeVertex">#</a> graph.<b>removeVertex</b>(string)

First argument is the label of the vertex you want to remove.
```js
// removeVertex() example
graph.removeVertex("1");
```
<a name="addVertex" href="#addVertex">#</a> graph.<b>addVertex</b>(string)

First argument is the vertex you want to add (its label).
```js
// addVertex() example
graph.addVertex("4");
```
<a name="addEdge" href="#addEdge">#</a> graph.<b>addEdge</b>(string, string)

First argument is one of the endpoints of the edge you want to add. The second argument is the other endpoint.
```js
// addEdge() example
graph.addEdge("4", "1");
```

<a name="addHull" href="#addHull">#</a> graph.<b>addHull</b>(string[])

An array of vertices you want a blob around.
```js
//  addHull() example
graph.addHull("1", "2");
```

<a name="removeEdge" href="#removeEdge">#</a> graph.<b>removeEdge</b>(string, string)

First argument is one of the endpoints of the edge you want to remove. The second argument is the other endpoint.
```js
// removeEdge() example
graph.removeEdge("1", "2");
```

<a name="changeLabel" href="#changeLabel">#</a> graph.<b>changeLabel</b>(string, string)

First argument is the label you want to change. Second argument is what you want to change the label to.
```js
//  changeLabel() example
graph.changeLabel("4", "b");
```

<a name="generateRandomGraph" href="#generateRandomGraph">#</a> graph.<b>generateRandomGraph</b>(number, number)

First argument is amount of vertices. Second argument is amount of edges.
```js
//  generateRandomGraph() example
graph.generateRandomGraph(10, 10);
```

<a name="contractEdge" href="#contractEdge">#</a> graph.<b>contractEdge</b>(string, string)

First argument is one of the endpoints of the edge you want to contract. The second argument is the other endpoint.
```js
//  generateRandomGraph() example
graph.contractEdge("1", "2");
```

<a name="curveEdge" href="#curveEdge">#</a> graph.<b>curveEdge</b>(string, string)

First argument is one of the endpoints of the edge you want to curve. The second argument is the other endpoint.
```js
//  curveEdge() example
graph.curveEdge("1", "2");
```
NOTE: When you create your `links` array for your graph you can alternatively pass in an attribute `hasCurve: true`.
```js
links: [
  { source: 1, target: 2 },
  { source: 2, target: 3, hasCurve: true}, // Curved link.
]
```

## Roadmap
---
- [x] Change color of vertices
- [x] Change color of edges
- [x] Create edge
- [x] Remove edge
- [x] create and remove vertices
- [x] Labels
- [x] Contract edge
- [x] Add hull
- [x] Generate a random graph
- [x] Color subset of vertices
- [x] Color subset of edges
- [x] Change size of node
- [x] Change size of edges
- [x] Change edge color by clicking on it
- [ ] Add live examples of methods
- [x] Ability for some edges to be curved
- [ ] Label pointing to a vertex
- [ ] Move graph to a specific coordinate
- [ ] Label pointing to blob
- [ ] Tooltip to vertex
- [ ] Tooltip to blob
- [ ] And re-layouting graphs (user can drag nodes to desired positions and take a snapshot)
- [ ] Hull tube
