const height = 650,width = 850,offset = 50;

let svgContainer =
d3.select("#graph").
append("svg").
attr("width", width).
attr("height", height);
let tooltip =
d3.select("body").
append("div").
attr("id", "tooltip").
style("opacity", 0);
let legend =
d3.select("#graph").
append("g").
attr("id", "legend");

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').
then(resp => resp.json()).
then(data => {
  const years = data.map(elem => elem["Year"]);
  const times = data.map(elem => {
    let parsedTime = elem["Time"].split(":");
    return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  const xScale =
  d3.scaleLinear().
  domain([d3.min(years) - 1, d3.max(years) + 1]).
  range([offset, width - offset]);
  const yScale =
  d3.scaleTime().
  domain([d3.max(times), d3.min(times)]).
  range([height - offset, offset]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));


  svgContainer.append('g').
  call(xAxis).
  attr("transform", "translate(0, " + (height - offset) + ")").
  attr('id', 'x-axis');
  svgContainer.append('g').
  call(yAxis).
  attr("transform", "translate(" + offset + ", 0)").
  attr('id', 'y-axis');

  svgContainer.selectAll(".dot").
  data(data).
  enter().
  append("circle").
  attr("class", "dot").
  attr("data-xvalue", (d, i) => {
    return years[i];
  }).
  attr("data-yvalue", (d, i) => {
    return times[i];
  }).
  attr("r", 5).
  style("fill", d => d.Doping != "" ? "red" : "teal").
  style("stroke", "black").
  attr("cx", (d, i) => xScale(years[i])).
  attr("cy", (d, i) => yScale(times[i])).
  on("mouseover", function (d, i) {
    tooltip.transition().
    duration(100).
    attr('data-year', years[i]).
    style('opacity', .9).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY + "px");
    tooltip.html(d.Name + ": " + d.Nationality + "<br/>" +
    "Year: " + years[i] + ", Time: " + d["Time"] + (
    d.Doping ? "<br/><br/>" + d.Doping : ""));
  }).
  on("mouseout", function (d, i) {
    tooltip.transition().
    duration(100).
    style('opacity', 0);
  });
});