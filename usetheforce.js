var width = innerWidth - 4;
var height = innerHeight - 4;
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
var nodes = d3.range(400).map(function (v) {
  return {
    radius: d3.randomUniform(1, 10)()
  };
});
var circleGroup = svg.append("g");
nodes.map(function (v, i) {
  v.el = circleGroup.append("circle")
    .attr("cx", (i % 20) * 40 + 40)
    .attr("cy", Math.floor(i / 20) * 25 + 25)
    .attr("r", v.radius)
    .attr("fill", d3.interpolateRainbow(Math.random()))
    .attr("stroke", "#000000")
    .attr("stroke-width", "0.5");
});
nodes.push({
  fx: 0,
  fy: 0,
  radius: 0
});
var controlled = circleGroup.append("circle")
  .attr("x", 0)
  .attr("y", 0)
  .attr("r", 0);
var els = circleGroup.selectAll("circle").data(nodes);
var mouseX = 0;
var mouseY = 0;
var mouseState = -1;
svg.on("mousedown", function (e) {
  mouseState = d3.event.button;
});
d3.select("body").attr("oncontextmenu", "return false;");
d3.select("body").on("mouseup", function () {
  mouseState = -1;
});
svg.on("mousemove", function () {
  var mcs = d3.mouse(this);
  mouseX = mcs[0];
  mouseY = mcs[1];
});
var sim = d3.forceSimulation(nodes)
  .alphaDecay(0)
  .force("posX", d3.forceX(width / 2).strength(0.01))
  .force("posY", d3.forceY(height / 2).strength(0.01))
  .force("collide", d3.forceCollide().strength(1).radius(function (node) {
    return node.radius;
  }))
  .force("mouse", d3.forceRadial(20, 0, 0).strength(- 0.01));
sim.on("tick", function () {
  controlled.fx = mouseX;
  controlled.fy = mouseY;
  var mouseStrength = 0;
  if (mouseState == 0) {
    mouseStrength = 0.1;
  } else if (mouseState == 2) {
    mouseStrength = -1;
  }
  sim.force("mouse", d3.forceRadial(20, mouseX, mouseY).strength(mouseStrength * 0.1));
  els.attr("cx", function (d) {
    return d.x;
  }).attr("cy", function (d) {
    return d.y;
  });
});