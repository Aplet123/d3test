var width = 2 * innerWidth / 3;
var height = innerHeight - 4;
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("contextmenu", function () {
    d3.event.preventDefault();
  });
var centerX = 0;
var centerY = 0;
var centerIndicator = svg.append("g");
centerIndicator.append("circle")
  .attrs({
    r: 10,
    "stroke-width": 3,
    stroke: "#0000ff",
    fill: "transparent",
    cx: 0,
    cy: 0
  });
centerIndicator.append("line")
  .attrs({
    x1: 0,
    y1: 15,
    x2: 0,
    y2: -15,
    "stroke-linecap": "round",
    "stroke-width": 3,
    stroke: "#0000ff"
  });
centerIndicator.append("line")
  .attrs({
    x1: 15,
    y1: 0,
    x2: -15,
    y2: 0,
    "stroke-linecap": "round",
    "stroke-width": 3,
    stroke: "#0000ff"
  });
var transforms = [1, 0, 0, 0, 1, 0];
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
var transLayer = svg.append("g");
var poly = svg.append("polygon")
  .attrs({
    fill: "transparent",
    stroke: "#000000",
    "stroke-width": 2,
    points: ""
  });
var pointLayer = svg.append("g");
var curId = 0;
function getNew (x, y) {
  var vx = x - centerX;
  var vy = y - centerY;
  return [transforms[0] * vx + transforms[1] * vy + transforms[2] + centerX, transforms[3] * vx + transforms[4] * vy + transforms[5] + centerY];
}
function updatePoly () {
  var pointList = "";
  pointLayer.selectAll("g")
    .sort(function (a, b) {
      return a.id - b.id;
    })
    .each(function (d) {
      pointList += d.x + "," + d.y + " ";
      var coords = getNew(d.x, d.y);
      if (transLayer.selectAll("circle").filter(function (da) {
        return da.id == d.id;
      }).size() > 0) {
        transLayer.selectAll("circle").filter(function (da) {
          return da.id == d.id;
        }).attrs({
          cx: coords[0],
          cy: coords[1]
        });
        var td = transLayer.selectAll("circle").filter(function (da) {
          return da.id == d.id;
        }).datum();
        td.x = coords[0];
        td.y = coords[1];
      } else {
        transLayer.append("circle")
          .datum({
            id: d.id,
            x: coords[0],
            y: coords[1]
          })
          .attrs({
            cx: coords[0],
            cy: coords[1],
            r: 5,
            fill: "#ffffff",
            stroke: "#ff0000",
            "stroke-width": 2
          });
      }
    });
  var transList = "";
  transLayer.selectAll("circle")
    .sort(function (a, b) {
      return a.id - b.id;
    })
    .each(function (d) {
      transList += d.x + "," + d.y + " ";
    });
  poly.attr("points", pointList);
  transpoly.attr("points", transList);
  centerIndicator.attr("transform", "translate(" + centerX + " " + centerY + ")");
}
function pointGen (x, y) {
  var pointG = pointLayer.append("g")
    .attr("transform", "translate(" + x + " " + y + ")")
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
      updatePoly();
    }));
  pointG.on("mousedown", function (d) {
    if (d3.event.button != 2) {
      return;
    }
    pointRemove(d.id);
    updatePoly();
    d3.event.stopPropagation();
  });
  pointG.on("dblclick taphold", function () {
    var td = d3.select(this).datum();
    transLayer.selectAll("circle")
      .filter(function (d) {
        return d.id == td.id;
      })
      .datum().id = curId;
    td.id = curId;
    curId ++;
    updatePoly();
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
svg.on("mousedown", function () {
  if (d3.event.button != 2) {
    return;
  }
  var coords = d3.mouse(this);
  pointGen(coords[0], coords[1]);
  updatePoly();
});
d3.select("#transformbutton").on("click", function () {
  for (var i = 1; i <= 2; i ++) {
    for (var j = 1; j <= 3; j ++) {
      var selection = d3.select("#input" + i + j);
      if (isNaN(Number(selection.property("value")))) {
        selection.property("value", selection.attr("value"));
      }
      transforms[(i - 1) * 3 + j - 1] = Number(selection.property("value"));
    }
  }
  updatePoly();
});
d3.select("body").on("keydown", function () {
  if (d3.event.key == "Enter") {
    d3.select("#transformbutton").dispatch("click");
  }
});
svg.call(d3.drag()
  .on("drag", function () {
    centerX = d3.event.x;
    centerY = d3.event.y;
    updatePoly();
  }));