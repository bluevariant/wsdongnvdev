## Usage/Examples

```javascript
const WebSocketClient = require("websocket").client;
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

client.connect("wss://ws.dongnv.dev/", undefined, "dongnv.dev", {
  identification: CLIENT_ID,
});
```
```python
import websocket
import json
import uuid

try:
    import thread
except ImportError:
    import _thread as thread
import time

CLIENT_ID = str(uuid.uuid4())


def on_message(ws, message):
    print(f"message: {message}")


def on_error(ws, error):
    print(error)


def on_close(ws):
    print("### closed ###")


def on_open(ws):
    def run(*args):
        for i in range(3):
            time.sleep(1)
            ws.send(
                json.dumps(
                    {
                        "to": "*",
                        "from": CLIENT_ID,
                        "content": "Hello",
                    }
                )
            )
        time.sleep(1)
        ws.close()
        print("thread terminating...")

    thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)

    ws = websocket.WebSocketApp(
        "wss://ws.dongnv.dev/",
        header={
            "identification": CLIENT_ID,
            "Origin": "dongnv.dev",
        },
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )

    ws.run_forever()
```

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
