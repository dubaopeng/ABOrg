var http = require('http');
var fs = require("fs");
 
http.createServer(function(request, response) {
    console.log("got request" + request.url);

    var D3Node = require('d3-node');
    var d3n = new D3Node();    // create instance 
    var d3 = d3n.d3
    //d3.select(d3n.document.body).append('span') // select <body> & insert span 

    var options = {selector: '#chart'}, container: '<div id="container"><div id="chart"></div></div>'}
    //var d3n = new D3Node(options) // initializes D3 with container element 
    d3.select(d3n.document.querySelector('#chart')).append('span') // insert span tag into #chart 
    d3n.html()

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(d3n.html());
    response.end();

    // if (request.url == "/") {
    //     fs.readFile("index.html", function(err, data){
    //         response.writeHead(200, {'Content-Type': 'text/html'});
    //         response.write(data);
    //         response.end();
    //     });
    // }
    // else {
    //     fs.readFile("." + request.url, function(err, data){
    //         if (data) {
    //             response.write(data);
    //             response.end();
    //         }
    //     });
    // }
}).listen(3000);


