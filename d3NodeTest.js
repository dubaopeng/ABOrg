var http = require('http');
var fs = require("fs");
var D3Node = require('d3-node');
var d3 = require('d3');
     
http.createServer(function(request, response) {
    console.log("got request" + request.url);

    var options = {selector: '#chart', container: '<div id="container"><div id="myDiv"><svg id="chart"></svg></div></div>'}
    var d3n = new D3Node(options) // initializes D3 with container element 

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 2000 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;
        
    var svg = d3.select(d3n.document.querySelector("#myDiv")).select("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var node = svg.selectAll("g.node")
        //.data(nodes, function(d) { return d.ident || (d.ident = ++i); });        

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(750)
       // .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        
    //d3.select(d3n.document.querySelector('#chart')).append('span') // insert span tag into #chart 

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(d3n.html());
    response.end();
}).listen(3000);