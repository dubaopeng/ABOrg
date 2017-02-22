function generateGraphData(results) {
    console.log(results);

    var graphData = [];
    var rowData = {};
    var AB = "Amazon Business";

    //Remove any empty row at the end of the csv data
    for (var i = results.length-1; i >= 0; i--) {
        if (results[i]["Feature Name"] == undefined || results[i]["Feature Name"] == "") {
            console.log("found empty row");
            results.splice(i, 1);
        }
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
            rowData.link = results[i]["Description"];
            rowData.icon = getTeamIcon(results[i]);
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
        rowData.link = results[i]["Team Wiki"];
        rowData.icon = "team";
        rowData.displayname = "Team Site";
        graphData.push(rowData);

        // Add UX Design nodes
        rowData = {};
        rowData.name = parentName + "+UX";
        rowData.parent = parentName;
        rowData.link = results[i]["UX Designs"];
        rowData.icon = "ux";
        rowData.displayname = "UX Designs";
        graphData.push(rowData);

        // Add Architecture Diagram nodes
        rowData = {};
        rowData.name = parentName + "+Architecture";
        rowData.parent = parentName;
        rowData.link = results[i]["Arch Designs"];
        rowData.icon = "architecture";
        rowData.displayname = "Architecture Designs";
        graphData.push(rowData);

        // Add Team Services nodes
        // rowData = {};
        // rowData.name = parentName + "+Services";
        // rowData.parent = parentName;
        // rowData.link = phoneTool;
        // rowData.icon = "service";
        // rowData.displayname = "Team Services";
        // graphData.push(rowData);

        // Add Team Contact nodes
        rowData = {};
        rowData.name = parentName + "+Contacts";
        rowData.parent = parentName;
        rowData.link = phoneTool;
        rowData.displayname = "Team Contacts";
        rowData.icon = "contacts";
        graphData.push(rowData);
    }

    // Need a pointer to the start of the previous level of the graph
    previousLevelOffset = graphData.length - results.length;
    graphDataLength = graphData.length;

    // Add the Team Contacts (Level 4)
    console.log("Level 4 starting...");
    var phoneTool = "https://phonetool.amazon.com/users/";

    for (var i = 0; i < results.length; i++) {        
        var rowData = {};
        rowData.name = results[i].SDM;
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "SDM: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        rowData = {};
        rowData.name = results[i].TPM;
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "TPM: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        rowData = {};
        rowData.name = results[i].UX;
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "UX: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        rowData = {};
        rowData.name = results[i]["Global PdM  Leader"];
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "Global PdM  Leader: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);
        
        rowData = {};
        rowData.name = results[i]["Global PdM"];
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "Global PdM: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        rowData = {};
        rowData.name = results[i]["EU PdM"];
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "EU PdM: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        rowData = {};
        rowData.name = results[i]["JP (AP) PdM"];
        rowData.parent = results[i]["Feature Name"] + "+Contacts";
        rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        rowData.icon = "";
        rowData.displayname = "JP PdM: " + getNameAndAlias(rowData.name)[0];
        graphData.push(rowData);

        // rowData = {};
        // rowData.name = results[i]["Dev Team Loc"];
        // rowData.parent = results[i]["Feature Name"] + "+Contacts";
        // rowData.link = phoneTool + getNameAndAlias(rowData.name)[1];
        // rowData.icon = "";
        // rowData.displayname = "Dev Team Loc: " + getNameAndAlias(rowData.name)[0];
        // graphData.push(rowData);

    }

    console.log(graphData);
    return graphData;
}

function getNameAndAlias(data) {
    if (data) {
        var result = data.split(";").map(function (elem) {
            return elem.trim();
        });
        return result;
    }

    return [""];
}

function getTeamIcon(data) {
    if (data) {
        if (data["Dev Team Loc"].toLowerCase().includes("mad")) {
            return "bull";
        }
        else if (data["Dev Team Loc"].toLowerCase().includes("sea")) {
            return "spaceneedle";
        }
        else if (data["Dev Team Loc"].toLowerCase().includes("aus")) {
            return "texas";
        }
        else if (data["Dev Team Loc"].toLowerCase().includes("hyd")) {
            return "india";
        }        
    }
}