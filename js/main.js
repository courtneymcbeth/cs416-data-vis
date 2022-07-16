var width = 1000;
var height = 500;

var projection = d3.geo.albersUsa().translate([width/2, height/2]).scale([1000]);
var path = d3.geo.path().projection(projection);

d3.csv("https://courtneymcbeth.github.io/cs416-data-vis/data/mod_MERGED2020_21_PP.csv", function(data) {
  d3.select('#locations').select('svg').selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
    if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
      return 0;
    }
		return projection([d.LONGITUDE, d.LATITUDE])[0];
	})
	.attr("cy", function(d) {
    if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
      return 0;
    }
		return projection([d.LONGITUDE, d.LATITUDE])[1];
	})
  .attr("r", function(d) {
    if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
      return 0;
    }
		return Math.sqrt(d.UG + d.GRADS) / 10;
	});
});