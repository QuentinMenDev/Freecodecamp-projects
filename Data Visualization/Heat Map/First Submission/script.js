const height = 600,width = 950,offset = 75;
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

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
d3.select("#legend").
append("svg").
attr("id", "legend").
attr("width", width).
attr("height", 50);

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').
then(resp => resp.json()).
then(data => {
  const dataSet = data.monthlyVariance;
  // month - 1 to get the good month name from the month array
  dataSet.forEach(elem => {
    elem.month = elem.month - 1;
    elem.monthName = month[elem.month];
  });

  const years = dataSet.map(elem => elem.year);
  const variances = dataSet.map(elem => elem.variance);

  const minYear = new Date(d3.min(years), 0);
  const maxYear = new Date(d3.max(years), 0);

  const xScale =
  d3.scaleTime().
  range([offset, width - offset]).
  domain([minYear, maxYear]);

  const yScale =
  d3.scaleBand().
  range([height - offset, offset]).
  domain(month);

  const xAxis =
  d3.axisBottom(xScale).
  tickFormat(d3.timeFormat('%Y'));
  const yAxis = d3.axisLeft(yScale);

  svgContainer.append('g').
  call(xAxis).
  attr("transform", "translate(0, " + (height - offset) + ")").
  attr('id', 'x-axis');
  svgContainer.append('g').
  call(yAxis).
  attr("transform", "translate(" + offset + ", 0)").
  attr('id', 'y-axis');

  const rectWidth = (width - 2 * offset) / (dataSet.length / 12);
  const rectHeight = (height - 2 * offset) / month.length;
  const colorScale =
  d3.scaleQuantile().
  domain([data.baseTemperature + d3.min(variances), data.baseTemperature + d3.max(variances)]).
  range(colors);

  svgContainer.selectAll(".cell").
  data(dataSet).
  enter().
  append("rect").
  attr("class", "cell").
  attr("x", d => xScale(new Date(d.year, 0))).
  attr("y", d => yScale(d.monthName)).
  attr("width", rectWidth).
  attr("height", rectHeight).
  attr("data-month", d => d.month).
  attr("data-year", d => d.year).
  attr("data-temp", d => d.variance + data.baseTemperature).
  style("fill", d => colorScale(d.variance + data.baseTemperature)).
  on("mouseover", function (d, i) {

    tooltip.transition().
    duration(100).
    attr('data-year', years[i]).
    style('opacity', .9).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY + "px");
    tooltip.html(d.year + ' - ' + d.monthName + "<br/>" +
    Math.round((data.baseTemperature + d.variance) * 10) / 10 + "°C<br/>" +
    Math.round(d.variance * 10) / 10 + "°C");
  }).
  on("mouseout", function (d, i) {
    tooltip.transition().
    duration(100).
    style('opacity', 0);
  });

  const minTemp = data.baseTemperature + d3.min(variances);
  const maxTemp = data.baseTemperature + d3.max(variances);
  const step = (maxTemp - minTemp) / colors.length;

  const legendArr = colors.map((elem, i) => {
    return Math.round((minTemp + i * step) * 100) / 100;
  });
  legendArr.push(maxTemp);

  console.log(legendArr);

  legend.selectAll("rect").
  data(legendArr).
  enter().
  append("rect").
  attr("x", (d, i) => offset + i * 25).
  attr("y", 10).
  attr("width", 25).
  attr("height", 25).
  style("fill", d => colorScale(d));
});