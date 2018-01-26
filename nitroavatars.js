d3.select("body")
	.style("background-color", "#000000");
var svg;
var coloredspin = d3.select("body")
	.append("svg")
	.attr("width", "256")
	.attr("height", "256")
	.style("border", "1px solid #ffffff");
svg = coloredspin;
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
var int = setInterval(function () {
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