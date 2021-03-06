// Annotation reference: https://bl.ocks.org/susielu/a464c24d8b42f0c4d9fafe7b48e9e60a

var visible = 0;
var divs = ["scatter2", "scatter", "locations"];

function go_back() {
  d3.select("#" + divs[visible]).classed("invis", true);
  if (visible == 0) {
    visible = 2;
    document.getElementById('back').disabled = false;
    document.getElementById('next').disabled = true;
  } else if (visible == 2) {
    visible = visible - 1;
    document.getElementById('back').disabled = false;
    document.getElementById('next').disabled = false;
  } else {
    visible = visible - 1;
    document.getElementById('back').disabled = true;
    document.getElementById('next').disabled = false;
  }
  d3.select("#" + divs[visible]).classed("invis", false);
}

function go_next() {
  d3.select("#" + divs[visible]).classed("invis", true);
  if (visible == 2) {
    visible = 0;
    document.getElementById('next').disabled = false;
    document.getElementById('back').disabled = true;
  } else if (visible == 0) {
    visible = visible + 1;
    document.getElementById('next').disabled = false;
    document.getElementById('back').disabled = false;
  } else {
    visible = visible + 1;
    document.getElementById('next').disabled = true;
    document.getElementById('back').disabled = false;
  }
  d3.select("#" + divs[visible]).classed("invis", false);
}

// D3 United States map reference: http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922

function init_loc() {
  var width = 1000;
  var height = 500;

  var projection = d3.geoAlbersUsa().translate([width / 2 - 90, height / 2]).scale([1000]);
  var path = d3.geoPath().projection(projection);

  var colors = d3.scaleLinear().domain([400, 1200, 1400, 1600])
    .range(["indigo", "darkmagenta", "red", "yellow"]);

  var rscale = d3.scaleSqrt().domain([100, 80000]).range([2, 20]);

  d3.select("#locations").select("svg").append("g").attr("transform", "translate(750, 350)")
    .attr("id", "deep-dive");

  var hscale = d3.scaleLinear().domain([0, 1]).range([100, 0]);
  var bscale = d3.scaleBand()
    .domain(["White", "Black", "Hisp.", "Asian", "Native", "Other"])
    .range([0, 180])
    .paddingInner(0);

  // JSON from https://eric.clst.org/tech/usgeojson/

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
          return rscale(d.UG + d.GRADS);
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
        })
        .on("click", function (d) {
          d3.select("#deep-dive").selectAll("*").remove();
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_WHITE))
            .attr("x", bscale("White"))
            .attr("height", 100 - hscale(d.UGDS_WHITE))
            .attr("width", 30)
            .style("fill", "indigo");
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_BLACK))
            .attr("x", bscale("Black"))
            .attr("height", 100 - hscale(d.UGDS_BLACK))
            .attr("width", 30)
            .style("fill", "darkmagenta");
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_HISP))
            .attr("x", bscale("Hisp."))
            .attr("height", 100 - hscale(d.UGDS_HISP))
            .attr("width", 30)
            .style("fill", "red");
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_ASIAN))
            .attr("x", bscale("Asian"))
            .attr("height", 100 - hscale(d.UGDS_ASIAN))
            .attr("width", 30)
            .style("fill", "darkorange");
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_AIAN))
            .attr("x", bscale("Native"))
            .attr("height", 100 - hscale(d.UGDS_AIAN))
            .attr("width", 30)
            .style("fill", "orange");
          d3.select("#deep-dive")
            .append("rect")
            .classed("bar-chart", true)
            .attr("y", hscale(d.UGDS_NHPI))
            .attr("x", bscale("Other"))
            .attr("height", 100 - hscale(d.UGDS_NHPI))
            .attr("width", 30)
            .style("fill", "gold");

          var bAxis = d3.axisBottom(bscale);
          d3.select("#deep-dive").append("g")
            .attr("transform", "translate(0,100)").call(bAxis);

          var hAxis = d3.axisLeft(hscale)
            .ticks(7);
          d3.select("#deep-dive").append("g")
            .attr("transform", "translate(0,0)").call(hAxis);

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "middle")
            .classed("caption", true)
            .attr("y", -50)
            .attr("x", -50)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Percent of Student Body (%)");

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "middle")
            .classed("caption", true)
            .attr("y", -20)
            .attr("x", 90)
            .attr("dy", ".75em")
            .text("Demographic Makeup");

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "start")
            .classed("caption", true)
            .attr("y", -50)
            .attr("x", 0)
            .attr("dy", ".75em")
            .text(function () {
              if (d.AVGFACSAL == "") {
                return "Avg. Faculty Salary: N/A"
              }
              return "Avg. Faculty Salary: $" + d.AVGFACSAL;
            });

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "start")
            .classed("caption", true)
            .attr("y", -70)
            .attr("x", 0)
            .attr("dy", ".75em")
            .text(function () {
              if (d.MENONLY == "") {
                return "Men-Only: N/A";
              } else if (d.MENONLY == 1) {
                return "Men-Only: Yes";
              } else {
                return "Men-Only: No";
              }
            });

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "start")
            .classed("caption", true)
            .attr("y", -90)
            .attr("x", 0)
            .attr("dy", ".75em")
            .text(function () {
              if (d.WOMENONLY == "") {
                return "Women-Only: N/A";
              } else if (d.WOMENONLY == 1) {
                return "Women-Only: Yes";
              } else {
                return "Women-Only: No";
              }
            });

          d3.select("#deep-dive").append("text")
            .attr("text-anchor", "start")
            .classed("caption-title", true)
            .attr("y", -110)
            .attr("x", 0)
            .attr("dy", ".75em")
            .text(d.INSTNM);
        });
    });
  });
}

function init_scatter() {
  var colors = d3.scaleLinear().domain([400, 1200, 1400, 1600])
    .range(["indigo", "darkmagenta", "red", "yellow"]);

  var xscale = d3.scaleLinear().domain([1, 0]).range([925, 50]);
  var yscale = d3.scaleLinear().domain([0, 42]).range([400, 0]);
  var rscale = d3.scaleSqrt().domain([100, 80000]).range([2, 20]);

  var chart = d3.select("#scatter").select("svg").append("g")
    .attr("transform", "translate(50,50)");

  var xAxis = d3.axisBottom(xscale)
    .ticks(7)

  chart.append("g")
    .attr("transform", "translate(0,400)").call(xAxis)

  d3.select("#scatter").select("svg").append("text")
    .attr("text-anchor", "middle")
    .attr("x", 500)
    .attr("y", 494)
    .text("Admission Rate (%)");

  var yAxis = d3.axisLeft(yscale)
    .ticks(5);

  chart.append("g")
    .attr("transform", "translate(50,0)").call(yAxis);

  d3.select("#scatter").select("svg").append("text")
    .attr("text-anchor", "middle")
    .attr("y", 25)
    .attr("x", -250)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Endowment at Beginning of Academic Year ($)");

  const type = d3.annotationLabel;

  const annotations = [{
    note: {
      label: "Harvard University had an endowment of about $42 billion",
      wrap: 150
    },
    //can use x, y directly instead of data
    x: 150,
    y: 65,
    dy: 50,
    dx: 50
  }, {
    note: {
      label: "Cornell University had the highest admission rate of the Ivy League at 10.7%",
      wrap: 150
    },
    //can use x, y directly instead of data
    x: 195,
    y: 380,
    dy: -75,
    dx: 50
  }];

  const makeAnnotations = d3.annotation()
    .editMode(false)
    //also can set and override in the note.padding property
    //of the annotation object
    .notePadding(15)
    .type(type)
    .annotations(annotations);

  d3.select("#scatter").select("svg")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);

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
        return yscale(d.ENDOWBEGIN / 1000000000);
      })
      .attr("r", function (d) {
        if (d.ENDOWBEGIN == "" || d.ADM_RATE == "") {
          return 0;
        }
        return rscale(d.UG + d.GRADS);
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

function init_scatter2() {
  var colors = d3.scaleLinear().domain([400, 1200, 1400, 1600])
    .range(["indigo", "darkmagenta", "red", "yellow"]);

  var xscale = d3.scaleLinear().domain([65000, 0]).range([925, 50]);
  var yscale = d3.scaleLinear().domain([0, 1]).range([400, 0]);
  var rscale = d3.scaleSqrt().domain([100, 80000]).range([2, 20]);

  var chart = d3.select("#scatter2").select("svg").append("g")
    .attr("transform", "translate(50,50)");

  var xAxis = d3.axisBottom(xscale)
    .ticks(7)

  chart.append("g")
    .attr("transform", "translate(0,400)").call(xAxis)

  d3.select("#scatter2").select("svg").append("text")
    .attr("text-anchor", "middle")
    .attr("x", 500)
    .attr("y", 494)
    .text("In-State Tuition ($)");

  var yAxis = d3.axisLeft(yscale)
    .ticks(5);

  chart.append("g")
    .attr("transform", "translate(50,0)").call(yAxis);

  d3.select("#scatter2").select("svg").append("text")
    .attr("text-anchor", "middle")
    .attr("y", 25)
    .attr("x", -250)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Percent of Students with Federal Loans (%)");

  const type = d3.annotationLabel;

  const annotations = [{
    note: {
      label: "Columbia University had the highest tuition at about $62,000",
      wrap: 150
    },
    //can use x, y directly instead of data
    x: 930,
    y: 375,
    dy: -200,
    dx: -10
  }];

  const makeAnnotations = d3.annotation()
    .editMode(false)
    //also can set and override in the note.padding property
    //of the annotation object
    .notePadding(15)
    .type(type)
    .annotations(annotations);

  d3.select("#scatter2").select("svg")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);

  d3.csv("https://courtneymcbeth.github.io/cs416-data-vis/data/mod_MERGED2020_21_PP.csv", function (data) {
    chart.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        if (d.TUITIONFEE_IN == "" || xscale(d.TUITIONFEE_IN) !== xscale(d.TUITIONFEE_IN)) {
          return 0;
        }
        return xscale(d.TUITIONFEE_IN);
      })
      .attr("cy", function (d) {
        if (d.PCTFLOAN == "" || yscale(d.PCTFLOAN) !== yscale(d.PCTFLOAN)) {
          return 0;
        }
        return yscale(d.PCTFLOAN);
      })
      .attr("r", function (d) {
        if (d.PCTFLOAN == "" || d.TUITIONFEE_IN == "") {
          return 0;
        }
        return rscale(d.UG + d.GRADS);
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

// Color Legend reference: https://bl.ocks.org/starcalibre/6cccfa843ed254aa0a0d

function init_legends() {
  var height = 350;
  var width = 25;

  // color legend

  var scale = ["indigo", "indigo", "indigo", "darkmagenta", "darkmagenta", "red", "yellow"];

  var gradient = d3.select("#color-legend")
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', '0%')
    .attr('y2', '0%')
    .attr('spreadMethod', 'pad');

  var pct = linspace(0, 100, scale.length).map(function (d) {
    return Math.round(d) + '%';
  });

  var colourPct = d3.zip(pct, scale);

  colourPct.forEach(function (d) {
    gradient.append('stop')
      .attr('offset', d[0])
      .attr('stop-color', d[1])
      .attr('stop-opacity', 1);
  });

  d3.select("#color-legend").append('g').attr("transform", "translate(0,25)")
    .append('rect')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'url(#gradient)');

  var legendScale = d3.scaleLinear()
    .domain([400, 1600])
    .range([height, 0]);

  var legendAxis = d3.axisRight(legendScale)
    .tickValues([400, 600, 800, 1000, 1200, 1400, 1600])
    .tickFormat(d3.format("d"));

  d3.select("#color-legend").append("g")
    .attr("transform", "translate(" + width + ", 25)")
    .call(legendAxis);

  d3.select("#color-legend").append("text")
    .attr("text-anchor", "middle")
    .attr("y", 75)
    .attr("x", -200)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average SAT Score");

  // circle size legend

  var rscale = d3.scaleSqrt().domain([100, 80000]).range([2, 20]);

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 50)
    .attr("r", rscale(100))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 50)
    .text("100");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 100)
    .attr("r", rscale(1000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 100)
    .text("1,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 150)
    .attr("r", rscale(5000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 150)
    .text("5,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 150)
    .attr("r", rscale(5000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 200)
    .text("10,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 200)
    .attr("r", rscale(10000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 250)
    .text("20,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 250)
    .attr("r", rscale(20000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 300)
    .text("50,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 300)
    .attr("r", rscale(50000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "start")
    .attr("x", 50)
    .attr("y", 350)
    .text("80,000");

  d3.select("#size-legend").append("circle")
    .attr("cx", 25)
    .attr("cy", 350)
    .attr("r", rscale(80000))
    .attr("stroke", "black");

  d3.select("#size-legend").append("text")
    .attr("text-anchor", "middle")
    .attr("y", 105)
    .attr("x", -200)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Total Number of Students");
}

function linspace(start, end, n) {
  var out = [];
  var delta = (end - start) / (n - 1);

  var i = 0;
  while (i < (n - 1)) {
    out.push(start + (i * delta));
    i++;
  }

  out.push(end);
  return out;
}