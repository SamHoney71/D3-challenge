// copied from 3-9
// creates a dynamic width & height as well as maintains the margin
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
    // console.log(healthData);


    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(healthData) {
      healthData.poverty = +healthData.poverty;   
      healthData.healthcare = +healthData.healthcare;
      healthData.age = +healthData.age;
      healthData.smokes = +healthData.smokes;
      healthData.obesity = +healthData.obesity;
      healthData.income = +healthData.income;
    //   console.log(healthData.income);  
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(healthData, d => d.poverty)])
      .range([0, width]);
    //   console.log(xLinearScale);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthData.poverty))
    .attr("cy", d => yLinearScale(d.healthData.healthcare))
    .attr("r", "5")
    .attr("fill", "blue")
    .attr("opacity", ".5");
    console.log(circlesGroup);

    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "d3-tip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>Percent in Poverty: ${d.poverty}<br>% Percent Lacking Healthcare: ${d.healthcare}`);
    //   });

//     // Step 7: Create tooltip in the chart
//     // ==============================
//     chartGroup.call(toolTip);

//     // Step 8: Create event listeners to display and hide the tooltip
//     // ==============================
//     circlesGroup.on("click", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percent Lacking Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percent in Poverty");
  }).catch(function(error) {
    console.log(error);
  });
