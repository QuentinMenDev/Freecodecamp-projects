const height = 650,width = 850,offset = 50;

let svgContainer =
d3.select("#graph").
append("svg").
attr("width", width).
attr("height", height);
let tooltip =
d3.select("#graph").
append("div").
attr("id", "tooltip").
style("opacity", 0);

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(resp => {
  return resp.json();
}).
then(data => {
  const dataSet = data.data;
  const GDP = dataSet.map(elem => elem[1]);
  const years = dataSet.map(elem => {return new Date(elem[0]);});
  const barWidth = width / dataSet.length;

  document.getElementById("title").innerHTML = data.name;

  const xScale =
  d3.scaleTime().
  domain([d3.min(years), d3.max(years)]).
  range([offset, width - offset]);
  const yScale =
  d3.scaleLinear().
  domain([0, d3.max(GDP)]).
  range([height - offset, offset]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svgContainer.append('g').
  call(xAxis).
  attr("transform", "translate(0, " + (height - offset) + ")").
  attr('id', 'x-axis');
  svgContainer.append('g').
  call(yAxis).
  attr("transform", "translate(" + offset + ", 0)").
  attr('id', 'y-axis');

  const scaling = d3.scaleLinear().
  domain([0, d3.max(GDP)]).
  range([offset, height - offset]);
  const scaled = GDP.map(elem => {
    return scaling(elem);
  });

  svgContainer.selectAll("rect").
  data(scaled).
  enter().
  append("rect").
  attr("x", (d, i) => {
    return xScale(years[i]);
  }).
  attr("y", d => {
    return height - d;
  }).
  attr("width", barWidth).
  attr("height", d => {
    return d - offset;
  }).
  attr("class", "bar").
  attr("data-date", (d, i) => {
    return dataSet[i][0];
  }).
  attr("data-gdp", (d, i) => {
    return dataSet[i][1];
  }).
  attr("fill", "#264653").
  on("mouseover", function (d, i) {
    d3.select(this).style("fill", "#E9C46A");

    // To change!!!!
    tooltip.transition().
    duration(200).
    style('opacity', .9);
    tooltip.html(years[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion').
    attr('data-date', data.data[i][0]).
    style('left', i * barWidth + 30 + 'px').
    style('top', height - 100 + 'px').
    style('transform', 'translateX(60px)');
  }).
  on("mouseout", function (d, i) {
    d3.select(this).style("fill", "#264653");

    tooltip.transition().
    duration(200).
    style('opacity', 0);
  });
});