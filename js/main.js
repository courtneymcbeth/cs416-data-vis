function init_loc() {
  var width = 1000;
  var height = 500;

  var projection = d3.geo.albersUsa().translate([width / 2, height / 2]).scale([1000]);
  var path = d3.geo.path().projection(projection);

  var colors = d3.scale.linear().domain([400, 1200, 1600])
    .range(["cornflowerblue", "mediumpurple", "crimson"]);

  d3.json("https://courtneymcbeth.github.io/cs416-data-vis/data/states.json", function (json) {
    d3.select('#locations').select('svg').selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#000")
      .style("stroke-width", "1")
      .style("fill", "#eee")

    d3.csv("https://courtneymcbeth.github.io/cs416-data-vis/data/mod_MERGED2020_21_PP.csv", function (data) {
      d3.select('#locations').select('svg').selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
            return 0;
          }
          return projection([d.LONGITUDE, d.LATITUDE])[0];
        })
        .attr("cy", function (d) {
          if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
            return 0;
          }
          return projection([d.LONGITUDE, d.LATITUDE])[1];
        })
        .attr("r", function (d) {
          if (projection([d.LONGITUDE, d.LATITUDE]) == null) {
            return 0;
          }
          return Math.sqrt(d.UG + d.GRADS) / 10;
        })
        .style("fill", function (d) {
          return colors(d.SAT_AVG);
        })
        .style("opacity", 0.8)
        .on("mouseover", function (d) {
          d3.select(".tooltip")
            .style("opacity", .9);
          d3.select(".tooltip").text(d.INSTNM)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          d3.select(".tooltip")
            .style("opacity", 0);
        });
    });
  });
}

function init_scatter() {
  var colors = d3.scale.linear().domain([400, 1200, 1600])
    .range(["cornflowerblue", "mediumpurple", "crimson"]);

  var xscale = d3.scale.linear().domain([1, 0]).range([925, 50]);
  var yscale = d3.scale.log().domain([1, 42000000000.0]).range([400, 0]);

  var chart = d3.select("#scatter").select("svg").append("g")
    .attr("transform", "translate(50,50)");

  var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom")
    .ticks(7)

  chart.append("g")
    .attr("transform", "translate(0,400)").call(xAxis)

  var yAxis = d3.svg.axis()
    .scale(yscale)
    .orient("left")
    .ticks(5);

  chart.append("g")
    .attr("transform", "translate(50,0)").call(yAxis);

  d3.csv("https://courtneymcbeth.github.io/cs416-data-vis/data/mod_MERGED2020_21_PP.csv", function (data) {
    chart.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        if (d.ADM_RATE == "") {
          return 0;
        }
        return xscale(d.ADM_RATE);
      })
      .attr("cy", function (d) {
        if (d.ENDOWBEGIN == "" || yscale(d.ENDOWBEGIN) !== yscale(d.ENDOWBEGIN)) {
          return 0;
        }
        return yscale(d.ENDOWBEGIN);
      })
      .attr("r", function (d) {
        if (d.ENDOWBEGIN == "" || d.ADM_RATE == "") {
          return 0;
        }
        return Math.sqrt(d.UG + d.GRADS) / 10;
      })
      .style("fill", function (d) {
        return colors(d.SAT_AVG);
      })
      .style("opacity", 0.8)
      .on("mouseover", function (d) {
        d3.select(".tooltip")
          .style("opacity", .9);
        d3.select(".tooltip").text(d.INSTNM)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        d3.select(".tooltip")
          .style("opacity", 0);
      });
  });
}