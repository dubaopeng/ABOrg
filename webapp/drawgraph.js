
function update(source) {
  // Compute the new tree layout.
  var nodes = tree(root),
	links = nodes.links();

  // Normalize for fixed-depth.
  nodes.each(function(d) { 
      d.y = d.depth * 300;
      d.x = d.x; 
    });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes.descendants().reverse(), function(d) { return d.ident || (d.ident = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click)
    .merge(node);

  nodeEnter.append("circle")
	  .attr("r", function (d) {return setRadius(d); })
	  .style("fill", function(d) { return setFillImage(d); });

  var nodeText = nodeEnter.append("text")
    .attr("x", function(d) { 
        var x = d.data.icon ? 40 : 13;
        x = (d.children || d._children) ? -x : x;
        return x;
    })
    .attr("dy", ".15em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) {
        return getInitialDisplayText(d); 
    })
    .style("fill-opacity", 1)
    .on("click", onNav)
    .on("mouseover", function(d){
        if (d.data.link) {
            tooltip._groups[0][0].innerHTML = d.data.link;
            return tooltip.style("visibility", "visible");
        }
    })
    .on("mousemove", function(d){
        if (d.data.link) {
        return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX+20)+"px");
        }
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  // If the node text is too long we need to add a tspan element for the rest.
  nodeText.append("tspan")
    .attr("dy", 15)
    .attr("x", function(d) { 
        var x = d.data.icon ? 40 : 13;
        x = (d.children || d._children) ? -x : x;
        return x;
    })
    .text(function(d) {
        return getRemainingDisplayText(d);  
    });

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
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
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
        return diagonal({source: o, target: o});
    })
    .merge(link);

  // Transition links to their new position.
  linkEnter.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		  var o = {x: source.x, y: source.y};
		  return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.each(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
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

var diagonal = abgraph_diagonal()
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

function isIE11() {
    var tmp = document.documentMode, e, isIE;

    // Try to force this property to be a string. 
    try{document.documentMode = "";}
    catch(e){ };

    // If document.documentMode is a number, then it is a read-only property, and so 
    // we have IE 8+.
    // Otherwise, if conditional compilation works, then we have IE < 11.
    // Otherwise, we have a non-IE browser. 
    isIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")( );

    // Switch back the value to be unobtrusive for non-IE browsers. 
    try{document.documentMode = tmp;}
    catch(e){ };

    return isIE;
}

function getInitialDisplayText(d) {
    var displayText = (d.data.displayname) ? d.data.displayname : d.id;
    var words = displayText.split(" ");
    if (displayText.length > 40) {
        var displayTextWrapped = "";
        for (var i = 0; i < Math.floor(words.length / 2); i ++) {
                displayTextWrapped += words[i] + " ";
        }
        return displayTextWrapped;
    }
    return displayText; 
}

function getRemainingDisplayText(d) {
    var displayText = (d.data.displayname) ? d.data.displayname : d.id;
    var words = displayText.split(" ");
    if (displayText.length > 40) {
        var displayTextWrapped = "";
        for (var i = Math.floor(words.length / 2); i < words.length; i ++) {
                displayTextWrapped += words[i] + " ";
        }
        return displayTextWrapped;
    }
    return ""; 
}