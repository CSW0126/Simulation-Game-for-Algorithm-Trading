const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000;
const server = http.createServer(app)
require('dotenv').config();
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

server.listen(port)
//log
console.log("----------------------------------------------------------------------")
// console.log("Find the IP that is same with your expo app IP")
// console.log("Copy the IP to the HOSTNAME in ../Application/App/constants/Host.js")
for (let i in addresses){
    console.log("Listen: [" +i+"] http://" + addresses[i] + ":" + port);
}

console.log("----------------------------------------------------------------------")