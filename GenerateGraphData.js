function generateGraphData(results) {
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
}