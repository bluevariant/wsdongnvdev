const WebSocketServer = require("websocket").server;
const http = require("http");
const _ = require("lodash");

const PORT = parseInt(process.env.PORT || 8080);
const server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
const connections = {};

server.listen(PORT, function () {
  console.log(new Date() + " Server is listening on port " + PORT);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  return origin.includes("dongnv.dev");
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(new Date() + " Connection from origin " + request.origin + " rejected.");
    return;
  }

  const identification = request.httpRequest.headers.identification;
  const connection = request.accept(undefined, request.origin);

  connections[identification] = connection;

  connection.on("message", function (message) {
    try {
      const data = JSON.parse(message.utf8Data);

      if (typeof data.to === "string") {
        if (data.to === "*") {
          _.forEach(connections, (connection, id) => {
            if (id !== identification) connection.send(message.utf8Data);
          });
        } else if (connections[data.to]) {
          connections[data.to].send(message.utf8Data);
        }
      } else if (Array.isArray(data.to)) {
        _.forEach(connections, (connection, id) => {
          if (data.to.includes(id)) connection.send(message.utf8Data);
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
  connection.on("close", () => {
    delete connections[identification];
  });
});
