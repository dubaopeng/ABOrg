var http = require('http');
var fs = require("fs");
var graph = require('./ABGraph.js');
var d3 = require('d3');
var d3hierarchy = require('d3-hierarchy');
var jsdom = require('jsdom');
     
     
http.createServer(function(request, response) {
    console.log("got request" + request.url);



    if (request.url == "/") {
        fs.readFile("aborg.html", "utf-8", function(err, data){

            var code = function(document){
                
                var tooltip = d3.select(document.querySelector("body"))
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a simple tooltip");

                var i = 0,
                    duration = 750,
                    root;

                var margin = {top: 20, right: 120, bottom: 20, left: 120},
                    width = 2000 - margin.right - margin.left,
                    height = 800 - margin.top - margin.bottom;
                    
                var tree = d3.layout.tree()
                    .size([height, width]);

                var svg = d3.select(document.querySelector("#graph"))
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                fs.readFile("./roadmap.csv", "utf-8", function(err, data){
                    var csvData = d3.csv.parse(data);
                    var graphData = graph.generateGraphData(csvData);

                    var treeData = d3hierarchy.stratify()
                        .id(function(d) { return d.name; })
                        .parentId(function(d) { return d.parent; })
                        (graphData);

                    // ************** Generate the tree diagram	 *****************
                    root = treeData;
                    root.x0 = height / 2;
                    root.y0 = 0;
                    
                    graph.update(root, root, tree, svg, i, duration);

                    //d3.select(self.frameElement).style("height", "500px");

                    // Compute the new tree layout.
                    var nodes = tree(root);

                    // // Normalize for fixed-depth.
                    // nodes.each(function(d) { 
                    //     //click(d);
                    //     if (d.children) {
                    //         d._children = d.children;
                    //         d.children = null;
                    //     } else {
                    //         d.children = d._children;
                    //         d._children = null;
                    //     } 
                    // });

                    // graph.update(root, root, tree, svg, i, duration);

                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(document.documentElement.outerHTML);
                    response.end();
                });

            }

            function getdoc(file, func){
                var document;
                jsdom.env(
                    file,
                    (err, window) => {
                        document = window.document
                        func(document)
                    }
                );
            }
            getdoc("aborg.html",code)

        });
    }
    else {
        fs.readFile("." + request.url, function(err, data){
            if (data) {
                response.write(data);
                response.end();
            }
        });
    }

}).listen(3000);


