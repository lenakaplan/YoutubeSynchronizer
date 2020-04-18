"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var uuid = require('uuid');
/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [ ];

var server = http.createServer(function(request, response) {
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    connection.id = uuid.v4();
    var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        // broadcast message to all connected clients
        console.log("from" + " " + connection.id );
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id !== connection.id) {
                console.log("to" + " " + clients[i].id );
                clients[i].send(message.utf8Data);
            }
        }
    });
    // user disconnected
    connection.on('close', function() {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients = clients.filter(conn => conn.id !== connection.id);
    });
});












