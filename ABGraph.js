var d3 = require('d3');

module.exports =  { 
    generateGraphData: function (results) {
        console.log(results);

        var graphData = [];
        var rowData = {};
        var AB = "Amazon Business";

        //Remove any empty row at the end of the csv data
        if (results[results.length-1]["Feature Name"] == undefined) {
            console.log("found empty row");
            results.splice(results.length-1, 1);
        }

        // Set the root node (Level 0)   
        rowData.name = AB;
        rowData.parent = "";
        rowData.link = "";
        rowData.icon = "";
        graphData[0] = rowData;

        // Add the Team Areas (Level 1)
        console.log("Level 1 starting...");
        var uniqueAreas = [];
        var parent = AB;
        for (var i = 0; i < results.length; i++) {
            if (!uniqueAreas.includes(results[i].Area)) {
                    var rowData = {};
                    rowData.name = results[i].Area;
                    rowData.parent = parent;
                    rowData.link = "";
                    rowData.icon = "";
                    graphData.push(rowData);
                    uniqueAreas.push(rowData.name);
            }
        }

        // Add the Team Names (Level 2)
        console.log("Level 2 starting...");
        for (var i = 0; i < results.length; i++) {
                var rowData = {};
                rowData.name = results[i]["Feature Name"];
                rowData.parent = results[i].Area;
                rowData.link = "";
                rowData.icon = "";
                graphData.push(rowData);
        }

        // Need a pointer to the start of the previous level of the graph
        previousLevelOffset = graphData.length - results.length;
        graphDataLength = graphData.length;

        // Add the team data nodes (Level 3)
        console.log("Level 3 starting...");
        for (var i = 0; i < results.length; i++) {        
            // Add Team Site nodes
            var rowData = {};
            var parentName = graphData[previousLevelOffset + i].name;
            rowData.name = parentName + "+Team";
            rowData.parent = parentName;
            rowData.link = "http://www.amazon.com";
            rowData.icon = "team";
            rowData.displayname = "Team Site";
            graphData.push(rowData);

            // Add UX Design nodes
            rowData = {};
            rowData.name = parentName + "+UX";
            rowData.parent = parentName;
            rowData.link = "http://www.amazon.com";
            rowData.icon = "ux";
            rowData.displayname = "UX Designs";
            graphData.push(rowData);

            // Add Architecture Diagram nodes
            rowData = {};
            rowData.name = parentName + "+Architecture";
            rowData.parent = parentName;
            rowData.link = "http://www.amazon.com";
            rowData.icon = "architecture";
            rowData.displayname = "Architecture Designs";
            graphData.push(rowData);

            // Add Team Services nodes
            rowData = {};
            rowData.name = parentName + "+Services";
            rowData.parent = parentName;
            rowData.link = "http://www.amazon.com";
            rowData.icon = "service";
            rowData.displayname = "Team Services";
            graphData.push(rowData);

            // Add Team Contact nodes
            rowData = {};
            rowData.name = parentName + "+Contacts";
            rowData.parent = parentName;
            rowData.link = "http://www.amazon.com";
            rowData.displayname = "Team Contacts";
            rowData.icon = "contacts";
            graphData.push(rowData);
        }

        // Need a pointer to the start of the previous level of the graph
        previousLevelOffset = graphData.length - results.length;
        graphDataLength = graphData.length;

        // Add the Team Contacts (Level 4)
        console.log("Level 4 starting...");
        for (var i = 0; i < results.length; i++) {        
            var rowData = {};
            rowData.name = results[i].SDM;
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "SDM: " + rowData.name;
            graphData.push(rowData);

            rowData = {};
            rowData.name = results[i].TPM;
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "TPM: " + rowData.name;
            graphData.push(rowData);

            rowData = {};
            rowData.name = results[i].UX;
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "UX: " + rowData.name;
            graphData.push(rowData);

            rowData = {};
            rowData.name = results[i]["International PdM"];
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "Intl PdM: " + rowData.name;
            graphData.push(rowData);

            rowData = {};
            rowData.name = results[i]["Global PdM  Leader"];
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "Global PdM  Leader: " + rowData.name;
            graphData.push(rowData);
            
            rowData = {};
            rowData.name = results[i]["Global PdM"];
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "Global PdM: " + rowData.name;
            graphData.push(rowData);

            rowData = {};
            rowData.name = results[i]["Dev Team Loc"];
            rowData.parent = results[i]["Feature Name"] + "+Contacts";
            rowData.link = "http://www.amazon.com";
            rowData.icon = "";
            rowData.displayname = "Dev Team Loc: " + rowData.name;
            graphData.push(rowData);

        }

        console.log(graphData);
        return graphData;
    },
    
    update: function (source, root, tree, svg, i, duration) {
        // Compute the new tree layout.
        var nodes = tree(root),
            links = nodes.links();

        // Normalize for fixed-depth.
        nodes.each(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes.descendants(), function(d) { return d.ident || (d.ident = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click)
            .merge(node);

        nodeEnter.append("circle")
            .attr("r", function (d) { return 10; })
            .style("fill", function(d) { return setFillImage(d); });

        var nodeText = nodeEnter.append("text")
            .attr("x", function(d) { 
            var x = d.data.icon ? 40 : 13;
            x = (d.children || d._children) ? -x : x;
            return x;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { 
            if (d.data.displayname) {
                return d.data.displayname;
            }
            return d.id; 
            })
            .style("fill-opacity", 1)
            .on("click", onNav)
            .on("mouseover", function(d){
            if (d.link) {
                tooltip[0][0].innerHTML = d.link;
                return tooltip.style("visibility", "visible");
            }
            })
            .on("mousemove", function(d){
            if (d.link) {
                return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX+20)+"px");
            }
            })
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        // Transition nodes to their new position.
        var nodeUpdate = nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", function (d) {return setRadius(d); })
            .style("fill", function(d) { return setFillImage(d); });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            //.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.ident; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return xxx({source: o, target: o});
            })
            .merge(link);
        

        // Transition links to their new position.
        linkEnter.transition()
            .duration(duration)
            .attr("d", xxx);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return xxx({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.each(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

function setFillImage(d) {
    if (d.data.icon) {
        var url = "url(#" + d.data.icon + ")";
        return url;
    }
    return d._children ? "lightsteelblue" : "#fff";
}

function setRadius(d) {
    if (d.data.icon) {
        return 30;
    }
    return 10;
}

function onNav(d) {
    if (d.data.link) {
        window.open(d.data.link);
    }
}


// var diagonal = d3.svg.diagonal()
//     .projection(function(d) { return [d.y, d.x]; });

// function diagonal(d) {
//   return "M" + d.source.y + "," + d.source.x
//       + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
//       + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
//       + " " + d.target.y + "," + d.target.x;
// }

var xxx = abgraph_diagonal()
    .projection(function(d) { 
        return [d.y, d.x]; 
});

function abgraph_diagonal() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function _diagonal(d, i) {
        var p0 = source.call(this, d, i), 
        p3 = target.call(this, d, i), 
        m = (p0.y + p3.y) / 2, 
        p = [ p0, {x: p0.x, y: m}, {x: p3.x, y: m}, p3 ];
        p = p.map(projection);
        return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    _diagonal.source = function(x) {
        if (!arguments.length) return source;
        source = d3_functor(x);
        return _diagonal;
    };
    _diagonal.target = function(x) {
        if (!arguments.length) return target;
        target = d3_functor(x);
        return _diagonal;
    };
    _diagonal.projection = function(x) {
        if (!arguments.length) return projection;
        projection = x;
        return _diagonal;
    };
    return _diagonal;
}

function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
}

function d3_source(d) {
    return d.source;
}
function d3_target(d) {
    return d.target;
}

function d3_functor(v) {
    return typeof v === "function" ? v : function() {
        return v;
    };
}