import { User } from "@/models/user";
import Cookies from "js-cookie";

export default function socketClient(
  messageHandler: (event: MessageEvent) => void
) {
  const user = Cookies.get("user")
    ? (JSON.parse(Cookies.get("user") as string) as User)
    : null;
  const email = user?.email;
  // const socketUrl = `ws:${
  //   process.env.WEBSOCKET_BASE_URL?.replace("http", "")
  //     .replace("https", "")
  //     .split(":")[1]
  // }:8765/ws?email=${email}`;
  const socketProtocol = process.env.ENV === "DEV" ? "ws" : "wss";
  const socketUrl = `${socketProtocol}:${
    process.env.BASE_URL?.replace("http://", "").replace("https://", "")}/ws?email=${email}`;
  const socket = new WebSocket(socketUrl);

  socket.onopen = function () {
    // console.log("Connected to WebSocket server");
  };

  socket.onmessage = function (event) {
    // You can handle incoming messages here
    // console.log("Message from server", event.data);

    messageHandler(event);
  };

  socket.onclose = function (event) {
    console.log("Disconnected:", event.reason);
    // You can handle disconnection events here
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
    // You can handle WebSocket errors here
  };

  // Define a function to send data to the server
  function send(data: any) {
    socket.send(data);
  }

  // Return the socket object and the send function
  return { socket, send };
}
