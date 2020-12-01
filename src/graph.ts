// @ts-nocheck
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  label: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
  d: number;
  s: number;
}

export default class Graph {
  // TODO: Find type for SVG
  svg: any;

  container: string;

  width: number;

  height: number;

  linkSvg: any;

  links: Link[];

  nodes: Node[];

  nodesInHull: Node[];

  simulation: any;

  lastId: number;

  constructor(container: string) {
    this.container = container;
    this.width = document.getElementById(this.container).offsetWidth;
    this.height = document.getElementById(this.container).offsetHeight;
  }

  setContainer(container: string) {
    this.container = container;
  }

  createSvg() {
    this.svg = d3
      .select(`#${this.container}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  createLinkSvg() {
    this.linkSvg = this.svg
      .selectAll('path')
      .data(this.links)
      .enter()
      .append('path')
      .style('stroke', '#a0c7e8')
      .style('fill', 'none')
      .style('stroke-width', '6.5px');
  }

  linkDis() {
    return d3
      .forceLink(this.links)
      .id((d: any) => d.id)
      .distance(() => 100)
      .strength(0.4);
  }

  moveLinks() {
    this.linkSvg
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('d', linkArc);
  }

  moveLabel() {
    this.svg
      .selectAll('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
  }

  moveCircle() {
    this.svg
      .selectAll('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }

  moveArrow(node: Node) {
    const nodeSvg = d3.select(`#graph-node-${this.labelledNode.id}`);

    const nod = document.getElementById(`graph-node-${this.labelledNode.id}`);
    const x = nod.getAttribute('cx');
    const y = nod.getAttribute('cy');

    this.arrow
      .attr('x1', x - 70)
      .attr('y1', y)
      .attr('x2', x - nodeSvg.attr('r') - 4)
      .attr('y2', y);

    const { top } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();
    const { left } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();

    this.tooltip
      .style('left', `${left}px`)
      .style('top', `${top}px`);
  }

  handleOnTick() {
    this.moveCircle();
    this.moveLabel();
    this.moveLinks();
    if (this.arrow) this.moveArrow();
    if (this.nodesInHull) this.highlightSeparatingNodes();
  }

  createSimulation() {
    this.simulation = d3
      .forceSimulation()
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX(this.width / 2).strength(0.01))
      .force('y', d3.forceY(this.height / 2).strength(0.01))
      .nodes(this.nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('link', this.linkDis())
      .force('collision', d3.forceCollide().radius(35))
      .on('tick', () => this.handleOnTick());
  }

  createNodeSvg() {
    this.nodeSvg = this.svg
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .style('fill', '#4682B4')
      .attr('id', (d) => `graph-node-${d.id}`)
      .style('stroke', '#a0c7e8')
      .style('stroke-width', '5px')
      .style('stroke-opacity', '0.8')
      .attr('r', 30)
      .call(d3.drag()
        .on('start', (event, v: any) => {
          d3.selectAll('circle').style('cursor', 'dragging');
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          [v.fx, v.fy] = [v.x, v.y];
        })
        .on('drag', (event, v: any) => {
          [v.fx, v.fy] = [event.x, event.y];
        })
        .on('end', (event, v: any) => {
          // this.svg.style('cursor', 'default');
          if (!event.active) this.simulation.alphaTarget(0);
          [v.fx, v.fy] = [null, null];
        }));
  }

  createLabels() {
    this.svg
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .text((node: Node) => (node.label ? node.label : node.id))
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('class', 'graph_label');
  }

  removeSvg(): void {
    this.svg.remove();
  }

  changeVerticesColor(subsetOfVertices: string[], color: string, animationTime: number) {
    this.nodeSvg
      .filter((node) => subsetOfVertices.includes(node.label))
      .transition()
      .style('fill', color)
      .duration(animationTime);
  }

  changeEdgesColor(subsetOfEdges: string[][], color: string, animationTime: number) {
    this.linkSvg
      .filter((link: Link) => {
        for (const l of subsetOfEdges) {
          const sourceNode: any = link.source;
          const targetNode: any = link.target;
          if (l.includes(sourceNode.label) && l.includes(targetNode.label)) return true;
        }
      })
      .transition()
      .style('stroke', color)
      .duration(animationTime);
  }

  getSelectionOfVertices(vertices: string[]) {
    return this.nodeSvg.filter((node: Node) => vertices.includes(node.label));
  }

  changeSizeOfVertices(vertices: string[], radius: number) {
    const verticesSelection = this.getSelectionOfVertices(vertices);
    verticesSelection.attr('r', radius);
  }

  getEdges(subsetOfEdges: string[][]) {
    return this.linkSvg
      .filter((link: Link) => {
        for (const l of subsetOfEdges) {
          const sourceNode: any = link.source;
          const targetNode: any = link.target;
          if (l.includes(sourceNode.label) && l.includes(targetNode.label)) return true;
        }
      });
  }

  changeSizeOfEdges(edges: string[][], strokeWidth: number) {
    const linkToChange = this.getEdges(edges);
    linkToChange.style('stroke-width', strokeWidth);
  }

  private getVertexToChange(vertex: string) {
    return this.nodeSvg.filter((node) => node.label == vertex);
  }

  changeAllVerticesColor(color: string, animationTime: number) {
    this.nodeSvg.transition().style('fill', color).duration(animationTime);
  }

  changeAllEdgesColor(color: string, animationTime: number) {
    this.linkSvg.transition().style('stroke', color).duration(animationTime);
  }

  restart() {
    this.updateLinkSvg();
    this.enterUpdateRemoveLabels();
    this.updateNodeSvg();
    this.restartSimulation();
  }

  private enterUpdateRemoveLabels() {
    this.svg
      .selectAll('text')
      .data(this.nodes, (d) => d.id)
      .join(
        (enter) => enter
          .append('text')
          .attr('dy', 4.5)
          .text((d) => d.id)
          .attr('class', 'graph-label'),
        (update) => update,
        (exit) => exit.remove(),
      );
  }

  private updateLinkSvg() {
    this.linkSvg
      .data(this.links, (d) => `v${d.source.id}-v${d.target.id}`)
      .join(
        (enter) => enter
          .append('line')
          .lower()
          .style('stroke', 'black'),
        (update) => update,
        (exit) => exit.remove(),
      );
  }

  private updateNodeSvg() {
    this.nodeSvg
      .data(this.nodes, (node) => node.id)
      .join(
        (enter) => enter
          .append('circle')
          .style('fill', 'red')
          .attr('r', 20),
        (update) => update,
        (exit) => exit.remove(),
      );
  }

  restartSimulation() {
    this.simulation.force('link').links(this.links);
    this.simulation.nodes(this.nodes);
    this.simulation.alpha(0.5).restart();
  }

  removeVertex(vertexToRemove: string) {
    const nodes: Node[] = this.nodes.filter((node) => node.label !== vertexToRemove);
    const linksToRemove: Link[] = this.links.filter((link: Link) => link.source.label === vertexToRemove || link.target.label === vertexToRemove);
    linksToRemove.map((link: Link) => this.links.splice(this.links.indexOf(link), 1));
    this.nodes = nodes;
    this.restart();
  }

  addVertex(vertexToAdd: string) {
    const node: Node = { id: ++this.lastId, label: vertexToAdd };
    this.nodes.push(node);
    this.restart();
  }

  addEdge(firstVertex: string, secondVertex: string) {
    const first: Node = this.nodes.find((node) => node.label == firstVertex);
    const second: Node = this.nodes.find((node) => node.label == secondVertex);
    const newLink: Link = { source: first, target: second };
    this.links.push(newLink);
    this.restart();
  }

  addHull(vertices: string[], color: string) {
    this.nodesInHull = this.nodes.filter((node) => vertices.includes(node.label));
    this.path.style('fill', color).style('stroke', color);
  }

  addLabelToBlob(text: string) {
    this.addTooltip();
    if (this.arrow) this.arrow.remove();

    await this.timeout(2000);

    const nod = document.getElementById('blob');
    const x = nod.getAttribute('cx');
    const y = nod.getAttribute('cy');

    this.arrow = this.svg
      .append('line')
      .style('opacity', 1)
      .attr('id', 'arrow-line')
      .attr('x1', x - 70)
      .attr('y1', y)
      .attr('x2', x - nodeSvg.attr('r') - 4)
      .attr('y2', y)
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke', 'rgb(51, 51, 51)')
      .attr('stroke-width', '3px');

    const { top } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();
    const { left } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();

    this.tooltip
      .html(text)
      .style('opacity', 1)
      .style('left', `${left}px`)
      .style('top', `${top}px`);
  }

  removeEdge(firstVertex: string, secondVertex: string) {
    const edgeToRemove: Link = this.links.find((link) => {
      const src: Node = link.source;
      const { target } = link;
      return (src.label === firstVertex && target.label === secondVertex) || (src.label === secondVertex && target.label === firstVertex);
    });
    const ind = this.links.indexOf(edgeToRemove);
    this.links.splice(ind, 1);
    this.restart();
  }

  changeVertexColor(vertex: string, color: string): void { // this is not in docs for now
    this.nodeSvg.filter((node) => node.label == vertex).style('fill', color);
  }

  changeLabel(vertex: string, label: string) {
    const node: Node = this.nodes.find((node) => node.label == vertex);
    node.label = label;
    this.updateLabels();
  }

  private updateLabels() {
    this.svg.selectAll('text')
      .data(this.nodes, (node) => node.id)
      .join(
        (enter) => enter,
        (update) => update.text((node) => node.label),
        (exit) => exit.remove(),
      );
  }

  generateRandomGraph(vertices: number, edges: number) {
    const randomGraph = generateRandomGraph(vertices, edges);
    this.load(randomGraph);
  }

  addHullPath() {
    this.path = this.svg
      .append('path')
      .attr('id', 'blob')
      .attr('fill', 'orange')
      .attr('stroke', 'orange')
      .attr('stroke-width', 16)
      .attr('opacity', 1);
  }

  highlightSeparatingNodes() {
    const line = d3.line().curve(d3.curveBasisClosed);
    let pointArr = [];
    const pad = 30;

    for (const node of this.nodesInHull) {
      pointArr = pointArr.concat([
        [node.x - pad, node.y - pad],
        [node.x - pad, node.y + pad],
        [node.x + pad, node.y - pad],
        [node.x + pad, node.y + pad],
      ]);
    }

    this.path.attr('d', line(hull(pointArr)));
    const nod = document.getElementById('blob');
    console.log(nod);
  }

  createArrow() {
    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('oriten', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');
  }

  load(graph: { nodes: Node; links: Link; }) {
    if (this.svg) this.removeSvg();
    this.createSvg();
    this.addHullPath();
    this.createArrow();
    this.nodes = graph.nodes;
    this.links = graph.links;
    this.lastId = graph.nodes.length;
    this.createLinkSvg();
    this.createSimulation();
    this.createNodeSvg();
    this.createLabels();
    this.simulation.force('link').links(this.links);
  }

  private findAllIncomingEdgesOfVertex(vertex: Node) {
    return this.links.filter((link: Link) => link.source === vertex || link.target === vertex);
  }

  colorEdge(link: Link, color: string) {
    const sourceNode: Node = link.source;
    const targetNode: Node = link.target;
    const newnew = [];
    newnew.push(sourceNode.label);
    newnew.push(targetNode.label);
    const test = [newnew];
    if (link.clicked) {
      link.clicked = false;
      this.changeEdgesColor(test, '#a0c7e8');
    } else {
      link.clicked = true;
      this.changeEdgesColor(test, color);
    }
  }

  curveEdge(firstNode: string, secondNode: string) {
    const edge = this.findEdge(firstNode, secondNode);
    edge.hasCurve = true;
  }

  moveGraph(x: number) {
    this.nodes.forEach((node: Node) => node.x = x);
  }

  colorEdgeOnRightClick(color: string) {
    this.linkSvg.on('contextmenu', (event, edge) => {
      event.preventDefault();
      this.colorEdge(edge, color);
    });
  }

  contractEdge(firstVertex: string, secondVertex: string) {
    const edgeToRemove: Link = this.findEdge(firstVertex, secondVertex);
    const { source } = edgeToRemove;
    const { target } = edgeToRemove;
    const inc = this.findAllIncomingEdgesOfVertex(source);
    const inc2 = this.findAllIncomingEdgesOfVertex(target);
    let allIncomingEdges: Link[] = inc.concat(inc2);
    this.links = this.links.filter((link: Link) => !allIncomingEdges.includes(link));

    const linkToRemove = allIncomingEdges.filter((link: Link) => link.source.label === firstVertex && link.target.label === secondVertex
        || link.source.label === secondVertex && link.target.label === firstVertex);

    allIncomingEdges = allIncomingEdges.filter((link: Link) => !linkToRemove.includes(link));
    this.nodes = this.nodes.filter((node: Node) => node.label !== secondVertex);

    allIncomingEdges.forEach((link: Link) => {
      if (link.source.label === secondVertex) link.source = target;
      if (link.target.label === secondVertex) link.target = target;
    });

    this.links = allIncomingEdges;
    this.restart();
  }

  private findNode(nodeLabel: string) {
    return this.nodes.find((node: Node) => node.label === nodeLabel);
  }

  private findEdge(sourceNode: string, targetNode: string): Link {
    return this.links.find((link) => {
      const src: Node = link.source;
      const { target } = link;
      return (src.label === sourceNode && target.label === targetNode) || (src.label === targetNode && target.label === sourceNode);
    });
  }

  addTooltip() {
    if (this.tooltip) this.tooltip.remove();

    this.tooltip = d3
      .select(`#${this.container}`)
      .append('div')
      .attr('id', 'node-label')
      .style('opacity', 0);
  }

  async timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async addLabel(nodeLabel: string, text: string) {
    this.addTooltip();
    if (this.arrow) this.arrow.remove();

    const node = this.findNode(nodeLabel);
    this.labelledNode = node;

    const nodeSvg = d3.select(`#graph-node-${nodeLabel}`);

    await this.timeout(2000);

    const nod = document.getElementById(`graph-node-${nodeLabel}`);
    const x = nod.getAttribute('cx');
    const y = nod.getAttribute('cy');

    this.arrow = this.svg
      .append('line')
      .style('opacity', 1)
      .attr('id', 'arrow-line')
      .attr('x1', x - 70)
      .attr('y1', y)
      .attr('x2', x - nodeSvg.attr('r') - 4)
      .attr('y2', y)
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke', 'rgb(51, 51, 51)')
      .attr('stroke-width', '3px');

    const { top } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();
    const { left } = document
      .getElementById('arrow-line')
      .getBoundingClientRect();

    this.tooltip
      .html(text)
      .style('opacity', 1)
      .style('left', `${left}px`)
      .style('top', `${top}px`);
  }
}

function generateRandomGraph(n, m) {
  const maxNumEdges = (n * (n - 1)) / 2;
  if (n < 0 || m < 0 || m > maxNumEdges) return undefined;

  const graph = { nodes: [], links: [] };

  for (let i = 0; i < n; i++) {
    graph.nodes[i] = { id: i + 1, label: JSON.stringify(i + 1) };
  }

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const state = {};
  for (let i = 0; i < m; i++) {
    const j = randomInt(i, maxNumEdges);
    if (!(i in state)) state[i] = i;
    if (!(j in state)) state[j] = j;
    [state[i], state[j]] = [state[j], state[i]];
  }

  function unpair(k) {
    const z = Math.floor((-1 + Math.sqrt(1 + 8 * k)) / 2);
    return [k - (z * (1 + z)) / 2, (z * (3 + z)) / 2 - k];
  }

  for (let i = 0; i < m; i++) {
    const [x, y] = unpair(state[i]);
    const u = graph.nodes[x];
    const v = graph.nodes[n - 1 - y];
    graph.links.push({ source: u, target: v });
  }
  return graph;
}

function hull(points) {
  if (points.length < 2) return;
  if (points.length < 3) return d3.polygonHull([points[0], ...points]);
  return d3.polygonHull(points);
}

function linkArc(d) {
  if (d.hasCurve) {
    const x1 = d.source.x;
    const y1 = d.source.y;
    const x2 = d.target.x;
    const y2 = d.target.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr = Math.sqrt(dx * dx + dy * dy);
    return `M${x1} ${y1} A${dr} ${dr + 500}, 0, 0 1, ${x2} ${y2}`;
  }
  return `M${d.source.x} ${d.source.y} ${d.target.x}  ${d.target.y}`;
}
