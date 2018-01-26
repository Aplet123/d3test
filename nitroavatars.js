d3.select("body")
	.style("background-color", "#000000");
var svg;
function addSVG (name) {
	window[name] = d3.select("body")
		.append("svg")
		.attr("width", "256")
		.attr("height", "256")
		.style("border", "1px solid #ffffff")
		.style("display", "block")
		.attr("id", name)
		.on("click", function () {
			if (location.hash == "#" + this.id) {
				location.hash = "#";
			} else {
				location.hash = "#" + this.id;
			}
		});
	svg = window[name];
}
addSVG("coloredspin");
(function (svg) {
	var spinGroup = svg.append("g")
		.attr("transform", "translate(128 128)");
	var arc = d3.arc()
		.innerRadius(0)
		.outerRadius(100);
	var splits = 360;
	var data = d3.range(splits).map(function (v) {
		return {
			color: d3.interpolateRainbow(v / splits),
			value: 1
		};
	});
	var pie = d3.pie()
		.sort(null)
		.value(function (v) {
			return v.value;
		})
		.padAngle(0);
	data = pie(data);
	var it = 0;
	setInterval(function () {
		if (it >= splits) {
			if (it < splits * 2) {
				spinGroup.attr("transform", "translate(128 128) rotate(" + ( it - 360 ) + ")");
			} else if (it < splits * 3) {
				spinGroup.attr("transform", "translate(128 128)");
				d3.select("path").remove();
			} else {
				it = -1;
			}
		} else {
			spinGroup.append("path")
				.datum(data[it])
				.attr("d", arc)
				.attr("fill", function (d) {
					return d.data.color;
				});
		}
		it ++;
	}, 5);
})(svg);
addSVG("centercircle");
(function (svg) {
	var rad = 90;
	var rot = 0;
	var inw = true;
	var spinGroup = svg.append("g")
		.attr("transform", "translate(128 128) rotate(0)");
	d3.range(6).map(function (v) {
		spinGroup.append("circle")
			.attr("cx", rad * Math.cos(v * Math.PI / 3))
			.attr("cy", rad * Math.sin(v * Math.PI / 3))
			.attr("r", "30")
			.attr("fill", d3.schemeSet1[v])
			.style("mix-blend-mode", "screen");
	});
	setInterval(function () {
		if (inw) {
			rad --;
		} else {
			rad ++;
		}
		spinGroup.selectAll("circle")
			.attr("cx", function (d, v) { return rad * Math.cos(v * Math.PI / 3); })
			.attr("cy", function (d, v) { return rad * Math.sin(v * Math.PI / 3); });
		rot ++;
		spinGroup.attr("transform", "translate(128 128) rotate(" + rot + ")");
		if (rad <= 0 || rad >= 90) {
			inw = ! inw;
		}
	}, 5);
})(svg);
addSVG("spherespin");
(function (svg) {
	var rad = 100;
	var splits = 20;
	var spinGroup = svg.append("g")
		.attr("transform", "translate(128 128)");
	function getPath (theta) {
		var article;
		if (Math.sin(theta) > 0) {
			article = " 0 1 0 ";
		} else {
			article = " 0 1 1 ";
		}
		return "M0 " + rad + " A " + (Math.sin(theta) * rad) + " " + rad + article + "0 " + (- rad);
	}
	d3.range(splits).map(function (v) {
		spinGroup.append("path")
			.datum({
				theta: 2 * Math.PI * v / splits
			})
			.attr("d", getPath(2 * Math.PI * v / splits))
			.attr("stroke", d3.interpolateRainbow(v / splits))
			.attr("stroke-width", "2")
			.style("mix-blend-mode", "lighten");
	});
	var it = 0;
	setInterval(function () {
		if (it > 2 * Math.PI) {
			it -= 2 * Math.PI;
		}
		spinGroup.selectAll("path")
			.attr("d", function (d) {
				return getPath(d.theta + it);
			});
		it += 0.005;
	}, 5);
})(svg);
if (location.hash && d3.select(location.hash).node()) {
	d3.selectAll("svg").style("display", "none");
	d3.select(location.hash).style("display", "block");
} else {
	d3.selectAll("svg").style("display", "block");
}
addEventListener("hashchange", function () {
	if (location.hash && d3.select(location.hash).node()) {
		d3.selectAll("svg").style("display", "none");
		d3.select(location.hash).style("display", "block");
	} else {
		d3.selectAll("svg").style("display", "block");
	}
});