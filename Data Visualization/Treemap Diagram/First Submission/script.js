const height = 600,width = 950,offset = 75;
let colors = [];
let categories = [];

const endpoints = {
  kickstarter: {
    title: "Kickstarter Pledges",
    description: "Top 100 Most Pledged Kickstarter Campaigns (Grouped By Category)",
    link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json" },

  movie: {
    title: "Movies Sales",
    description: "Top 100 Highest Grossing Movies (Grouped By Genre)",
    link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json" },

  game: {
    title: "Video Game Sales",
    description: "Top 100 Most Sold Video Games (Grouped by Platform)",
    link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json" } };


let selected = "game";

let svgContainer =
d3.select("#graph").
append("svg").
attr("width", width).
attr("height", height);
let tooltip =
d3.select("body").
append("div").
style("opacity", 0);
let treemap = d3.treemap().
size([width, height]).
padding(1);
let legend = d3.select("#legend");

function updatePage() {
  fetch(endpoints[selected].link).
  then(resp => resp.json()).
  then(data => {
    document.getElementById("title").innerHTML = endpoints[selected].title;
    document.getElementById("description").innerHTML = endpoints[selected].description;

    const root = d3.hierarchy(data).
    eachBefore(d => {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    }).
    sum(d => d.value).
    sort((a, b) => {
      return b.height - a.height || b.value - a.value;
    });

    treemap(root);
    categories = root.children.map(elem => elem.data.name);

    colors = [...d3.schemeSet2, ...d3.schemeSet3];

    let color = d3.scaleOrdinal().
    domain(categories).
    range(colors);

    let cell = svgContainer.selectAll("g").
    data(root.leaves()).
    enter().
    append("g").
    attr("class", "group").
    attr("transform", d => `translate(${d.x0},${d.y0})`);

    let tile = cell.append("rect").
    attr("id", d => {
      return d.data.id;
    }).
    attr("class", "tile").
    attr("width", d => d.x1 - d.x0).
    attr("height", d => d.y1 - d.y0).
    attr("data-name", d => d.data.name).
    attr("data-category", d => d.data.category).
    attr("data-value", d => d.data.value).
    style("fill", d => color(d.parent.data.name)).
    on("mousemove", d => {
      tooltip.style("opacity", .9).
      attr("id", "tooltip");
      tooltip.html(
      'Name: ' + d.data.name +
      '<br/> Category: ' + d.data.category +
      '<br/> Value: ' + d.data.value).

      attr("data-value", d.data.value).
      style("left", d3.event.pageX + 20 + "px").
      style("top", d3.event.pageY - 25 + "px");
    }).
    on("mouseout", d => {
      tooltip.style("opacity", 0);
    });

    cell.append("text").
    attr('class', 'tile-text').
    selectAll("tspan").
    data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
    enter().
    append("tspan").
    attr("x", 4).
    attr("y", (d, i) => 13 + i * 10).
    text(d => d);

    const legendParam = {
      offset: 10,
      rectSize: 10,
      hSpacing: 150,
      vSpacing: 10,
      textOffsetX: 3,
      textOffsetY: -2 };

    let legendElemsPerCol = Math.floor(width / legendParam.hSpacing);


    let legendElem = legend.append("g").
    attr("transform", "translate(0," + legendParam.offset + ")").
    selectAll("g").
    data(categories).
    enter().append("g").
    attr("transform", (d, i) => 'translate(' +
    Math.floor(i / legendElemsPerCol) * legendParam.hSpacing + ',' + (i % legendElemsPerCol * legendParam.rectSize + i % legendElemsPerCol * legendParam.vSpacing) + ')');

    legendElem.append("rect").
    attr('width', legendParam.rectSize).
    attr('height', legendParam.rectSize).
    attr('class', 'legend-item').
    attr('fill', d => color(d));

    legendElem.append("text").
    attr('x', legendParam.rectSize + legendParam.textOffsetX).
    attr('y', legendParam.rectSize + legendParam.textOffsetY).
    text(d => d);
  });
}

updatePage();