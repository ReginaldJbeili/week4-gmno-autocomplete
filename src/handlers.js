const data = require('./data');
const fs = require('fs');
const path = require('path');
const url = require ('url');

const search = term => {
    if (term === "") {
        return [];
    }

    return data.filter(site => {
        let siteLowerCase = site.toLowerCase();
        let termLowerCase = decodeURI(term.toLowerCase());
        return (
        siteLowerCase.startsWith(termLowerCase) && 
        siteLowerCase !== termLowerCase
        );
    });
}

const handleHome = (request, response) => {
    const filePath = path.join(__dirname, '..', 'public', 'index.html'); //asynchronous way
    fs.readFile(filePath, (error, file) => { // gives you a cb, either an error or the file
        if (error) {
            console.log(error);
            response.writeHead(500, {
                'Content-Type': 'text/html'
            }); // 500 server-side error
            response.end("<h1>Sorry we had a problem at our end</h1>");
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            }); //so the server can expect a HTML file coming in
            response.end(file);
        }
    });
}

const handlePublic = (request, response, endpoint) => { // PASS THE URL
    const extension = endpoint.split('.')[1];
    const extensionType = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/js',
        ico: 'image/x-icon',
        svg: 'image/svg+xml',
        jpeg: 'image/jpeg'
    };
    const filePath = path.join(__dirname, '..', endpoint);
    fs.readFile(filePath, (error, file) => {
        if (error) {
            console.log(error);
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.end("<h1>404 not found </h1>");

        }  else {
            response.writeHead(200, {
                'Content-Type': extensionType[extension]
            });
            response.end(file);
        } 
        }
    )    
}

const handleData = (request, response, endpoint) => {
let urlObject = url.parse(endpoint);
let searchTerm = urlObject.query.split("=")[1];
let result = search(decodeURI(searchTerm));
response.writeHead(200, { "Content-Type": "application/json" });
response.end(JSON.stringify(result));
}

module.exports = {
    handleHome,
    handlePublic,
    handleData,
    search
}
