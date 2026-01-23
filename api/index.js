import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/socket/index.js";

const server = http.createServer(app);
initSocket(server);
const PORT = 3000;
server.listen(PORT, () => console.log("running"));
