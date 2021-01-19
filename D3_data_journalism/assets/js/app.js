// copied from 3-9
// creates a dynamic width & height as well as maintains the margin
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
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

  // Import Data from CSV
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
    //   console.log(healthData.poverty);  
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);
    //   console.log(xLinearScale);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(healthData, d => d.healthcare)])
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
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    // .attr("class", "#stateText")
    .attr("class", "#stateCircle")
    .attr("opacity", ".5")
    .classed("stateCircle", true);

    //Step 5a:  Add State Initials into Circles
    //====================================
    var stateText = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 3)
    .attr("font-size", "9px")
    .text(function(d) {return d.abbr});
        
      

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Percent in Poverty: ${d.poverty}<br>% Percent Lacking Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart respond to State Text
    // ==============================
    stateText.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip.  Responds to State Text
    // ==============================
    stateText.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 5})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

 
  


  }).catch(function(error) {
    console.log(error);
  });
