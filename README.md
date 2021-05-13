## Usage/Examples

```javascript
const WebSocketClient = require("websocket").client;
const { v4 } = require("uuid");

const client = new WebSocketClient();
const CLIENT_ID = v4();

client.on("connectFailed", function (error) {
  console.log("Connect Error: " + error.toString());
});

client.on("connect", (connection) => {
  connection.on("error", (error) => {
    console.log("Connection Error: " + error.toString());
  });
  connection.on("close", () => {
    console.log("echo-protocol Connection Closed");
  });
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });

  function sendNumber() {
    if (connection.connected) {
      var number = Math.round(Math.random() * 0xffffff);
      // connection.sendUTF(number.toString());
      connection.send(
        JSON.stringify({
          from: CLIENT_ID,
          to: "*",
          content: "Hello",
        })
      );
      setTimeout(sendNumber, 1000);
    }
  }
  sendNumber();
});

client.connect("wss://ws.dongnv.dev/", "echo-protocol", "dongnv.dev", {
  identification: CLIENT_ID,
});
```

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
