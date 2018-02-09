var width = 2 * innerWidth / 3;
var height = innerHeight - 4;
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("contextmenu", function () {
    d3.event.preventDefault();
  });
svg.lower();
d3.select("table")
  .style("width", innerWidth / 3 - 4);
var transpoly = svg.append("polygon")
  .attrs({
    fill: "transparent",
    stroke: "#ff0000",
    "stroke-width": 2,
    points: ""
  });
var poly = svg.append("polygon")
  .attrs({
    fill: "transparent",
    stroke: "#000000",
    "stroke-width": 2,
    points: ""
  });
var transLayer = svg.append("g");
var pointLayer = svg.append("g");
var curId = 0;
function updatePoly () {
  var pointList = "";
  pointLayer.selectAll("g")
    .sort(function (a, b) {
      return a.id - b.id;
    })
    .each(function (d) {
      pointList += d.x + "," + d.y + " ";
    });
  poly.attr("points", pointList);
  transpoly.attr("points", pointList);
}
function pointGen (x, y) {
  var pointG = pointLayer.append("g")
    .attr("transform", "translate(" + x + " " + y + ")")
    .datum({
      id: curId,
      x: x,
      y: y
    });
  var transG = transLayer.append("circle")
    .attrs({
      cx: x,
      cy: y,
      r: 5,
      fill: "#ffffff",
      stroke: "#ff0000",
      "stroke-width": 2
    })
    .datum({
      id: curId,
      x: x,
      y: y
    });
  pointG.append("circle")
    .attrs({
      cx: 0,
      cy: 0,
      r: 5,
      fill: "#ffffff",
      stroke: "#000000",
      "stroke-width": 2
    });
  pointG.append("circle")
    .attrs({
      cx: 0,
      cy: 0,
      r: 10,
      fill: "transparent"
    });
  pointG.call(d3.drag()
    .on("drag", function (d) {
      d.x = d3.event.x;
      d.y = d3.event.y;
      d3.select(this)
        .attr("transform", "translate(" + d.x + " " + d.y + ")");
      transG.datum().x = d3.event.x;
      transG.datum().y = d3.event.y;
      transG.attrs({
        cx: d3.event.x,
        cy: d3.event.y
      });
      updatePoly();
    }));
  pointG.on("dblclick taphold", function (d) {
    pointRemove(d.id);
    updatePoly();
    d3.event.stopPropagation();
  });
  pointG.on("mousedown", function () {
    if (d3.event.button == 2) {
      d3.select(this).datum().id = curId;
      curId ++;
      updatePoly();
    }
  });
  curId ++;
}
function pointRemove (id) {
  pointLayer.selectAll("g")
    .filter(function (d) {
      return d.id == id;
    })
    .remove();
  transLayer.selectAll("circle")
    .filter(function (d) {
      return d.id == id;
    })
    .remove();
}
pointGen(100, 100);
pointGen(200, 100);
pointGen(200, 200);
pointGen(100, 200);
updatePoly();
svg.on("dblclick taphold", function () {
  var coords = d3.mouse(this);
  pointGen(coords[0], coords[1]);
  updatePoly();
});
d3.select("#transformbutton").on("click", function () {
  var transstr = "";
  for (var i = 1; i <= 3; i ++) {
    for (var j = 1; j <= 2; j ++) {
      if (isNaN(Number(d3.select("#input" + j + i).property("value")))) {
        d3.select("#input" + j + i).property("value", d3.select("#input" + j + i).attr("value"));
      }
      transstr += d3.select("#input" + j + i).property("value") + " ";
    }
  }
  transstr = "matrix(" + transstr.replace(/\s$/, "") + ")";
  transpoly.attr("transform", transstr);
  transLayer.attr("transform", transstr);
});