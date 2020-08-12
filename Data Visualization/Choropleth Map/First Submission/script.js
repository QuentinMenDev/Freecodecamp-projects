const height = 600,width = 950,offset = 75;
const colors = ["#f7fbff", "#e3eef9", "#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5", "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"];

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
let legend = svgContainer.append("g").
attr("class", "key").
attr("id", "legend").
attr("transform", "translate(0,40)");


let educationData = null;
let countyData = null;
let path = d3.geoPath();


fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').
then(resp => resp.json()).
then(data => {
  educationData = data;

  return fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
}).
then(resp => resp.json()).
then(data => {
  countyData = data;

  const bachelors = educationData.map(elem => elem.bachelorsOrHigher);


  const colorScale =
  d3.scaleQuantile().
  domain([d3.min(bachelors), d3.max(bachelors)]).
  range(colors);

  svgContainer.append("g").
  attr("class", "counties").
  selectAll("path").
  data(topojson.feature(countyData, countyData.objects.counties).features).
  enter().append("path").
  attr("class", "county").
  attr("d", path).
  style("fill", d => {
    let filterEdu = educationData.filter(elem => elem.fips == d.id);

    if (filterEdu[0]) {
      return colorScale(filterEdu[0].bachelorsOrHigher);
    }
    return colorScale(0);
  }).
  attr("data-education", d => {
    let filterEdu = educationData.filter(elem => elem.fips == d.id);

    if (filterEdu[0]) {
      return filterEdu[0].bachelorsOrHigher;
    }
    return 0;
  }).
  attr("data-fips", d => d.id).
  on("mouseover", function (d, i) {
    tooltip.transition().
    duration(100).
    attr("data-education", () => {
      let filterEdu = educationData.filter(elem => elem.fips == d.id);

      if (filterEdu[0]) {
        return filterEdu[0].bachelorsOrHigher;
      }
      return 0;
    }).
    style('opacity', .9).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - 20 + "px");
    tooltip.html(function () {
      let filterEdu = educationData.filter(elem => {
        return elem.fips == d.id;
      });

      if (filterEdu[0]) {
        return filterEdu[0]['area_name'] + ', ' + filterEdu[0]['state'] + ': ' + filterEdu[0].bachelorsOrHigher + '%';
      }
      //could not find a matching fips id in the data
      return 0;
    });
  }).
  on("mouseout", function (d, i) {
    tooltip.transition().
    duration(100).
    style('opacity', 0);
  });

  const minBach = d3.min(bachelors);
  const maxBach = d3.max(bachelors);
  const step = (maxBach - minBach) / colors.length;

  const legendArr = colors.map((elem, i) => {
    return Math.round((minBach + i * step) * 100) / 100;
  });
  legendArr.push(maxBach);

  console.log(legendArr);

  legend.selectAll("rect").
  data(legendArr).
  enter().
  append("rect").
  attr("x", (d, i) => width - offset - legendArr.length * 25 + i * 25).
  attr("y", 0).
  attr("width", 25).
  attr("height", 25).
  style("fill", d => colorScale(d));
});