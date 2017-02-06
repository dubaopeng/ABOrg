
function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.ident || (d.ident = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

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
	  .style("fill-opacity", 1e-6)
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
  var nodeUpdate = node.transition()
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
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
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
  nodes.forEach(function(d) {
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
