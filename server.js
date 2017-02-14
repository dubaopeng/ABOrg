var http = require('http');
var fs = require("fs");
 
http.createServer(function(request, response) {
    console.log("got request" + request.url);

    if (request.url == "/") {
        fs.readFile("index.html", function(err, data){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
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