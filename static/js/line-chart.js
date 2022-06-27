console.log("pieline.js is loaded")

function drawScatterplot(state) {
    console.log (`DrawScatterplot (${state})`);
    
    data = [
        {"Cause": "Debris Burning", "Count": 2, "State": "IN", "Year": 2013},
        {"Cause": "Miscellaneous", "Count": 16, "State": "IN", "Year": 2005},
        {"Cause": "Campfire", "Count": 6, "State": "IN", "Year": 2010},
        {"Cause": "Miscellaneous", "Count": 4, "State": "IN", "Year": 2015},
        {"Cause": "Railroad", "Count": 2, "State": "IN", "Year": 2006},
        {"Cause": "Missing/Undefined", "Count": 108, "State": "IN", "Year": 2007},
        {"Cause": "Equipment Use", "Count": 2, "State": "IN", "Year": 2004},
        {"Cause": "Smoking", "Count": 2, "State": "IN", "Year": 1994},
        {"Cause": "Equipment Use", "Count": 2, "State": "IN", "Year": 1998},
        {"Cause": "Powerline", "Count": 6, "State": "IN", "Year": 2000},
        {"Cause": "Arson", "Count": 32, "State": "IN", "Year": 1996},
        ];

    // sort data by year so early years are added to the chart on the left and then to the right for later dates.
    data.sort((a,b) => (a.Year > b.Year) ? 1: -1)
    
    // //map the year to a list
    // let year = state_filtered.map(o => o.Year);

    // //map the causes to a list
    // let causes = state_filtered.map(o => o.Cause);
    // console.log(causes);

    // //map the count to a list
    // let counts = state_filtered.map(o => o.Count);
    // console.log("counts");
    // console.log(counts);

    var linechartbox = document.querySelector('#line_graph') //selects line chart div
    var width = linechartbox.clientWidth - 50;               //gets line chart div and subtracts 50px;
    var height = 300;
    var margin = 50;
    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;

    console.log("dataview", data)

    var parseDate = d3.timeParse("%Y");
    data.forEach(function(d) { 
        d.Year = parseDate(d.Year);
        d.Count = +d.Count;    
    });
    console.log("dataparse", data)

/* Scale */
    var xScale = d3.scaleTime()
    // .domain(d3.extent(data[0].values, d => d.Year))
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
    .range([0, width-margin]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Count)])
    .range([height-margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var svg = d3.select("#line_graph").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);


    /* Add line into SVG */
    var line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Count));

    let lines = svg.append('g')
    .attr('class', 'lines');
    

    console.log(data);
    var datacounts = data.map(o => o.Count);

    lines.selectAll('.line-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {
        svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))        
            .text(d.Cause)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
        })
    .append('path')
    .datum(data)
    .attr('class', 'line')  
    .attr('d', line)
    .style('stroke', (d,i) => color(i))    // color(i) can be replaced with "black"
    .style('stroke-width', "3")
    .style('fill', 'none')
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
                        .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
                        .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
                        .style('opacity', lineOpacity);
        d3.selectAll('.circle')
                        .style('opacity', circleOpacity);
        d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });


    /* Add circles in the line */
    lines.selectAll("circle-group")
    .data(data)
    .enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(data).enter()
    .append("g")
    .attr("class", "circle")  
    .on("mouseover", function(d) {
        d3.select(this)     
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.Count}`)
            .attr("x", d => xScale(d.Year) + 5)
            .attr("y", d => yScale(d.Count) - 10);
        })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("cursor", "none")  
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
    .append("circle")
    // .attr("stuff", d => console.log("year data", d.Year))
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Count))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
            d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
        .on("mouseout", function(d) {
            d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });


    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Total values");
    

};
drawScatterplot("IN");

// function drawPie(state) {

//     d3.json("/pie_data").then(data => {

//     //filter data down to one state only
//     let state_filtered = data.filter(s => s.State === state);
   
//     //map the causes to a list
//     let causes = state_filtered.map(o => o.Cause);
//     console.log(causes);

//     //map the count to a list
//     let counts = state_filtered.map(o => o.Count);
//     console.log("counts");
//     console.log(counts);

//     });
// }    
    
// //call and update drawPie function when a new state is selected
// function optionChanged(state) {
//     console.log(`State Changed to (${state})`);

//     drawScatterplot(state);
//     drawPie(state);
// }

// // Initialize Dropdown Menu Control
// function InitPie() {

//     console.log("InitPie has run");
//     let selector = d3.select("#selDataset");

//     d3.json("/pie_data").then(data => {
//         console.log(data);

//         let uniqueStates = [...new Set(data.map(o => o.State))];
//         console.log(uniqueStates);

//         let statesSorted = uniqueStates.sort();

//         statesSorted.forEach(state => {
//             selector.append("option")
//                 .text(state)
//                 .property("value", state);
//         });

//         let state = uniqueStates[0];
//         console.log("initial state");
//         console.log(state);
        
//         drawScatterplot(state);
//         drawPie(state);
    
//     });
// }
// InitPie();