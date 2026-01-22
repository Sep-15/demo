import express from "express";
import cors from "cors";
import router from "./routes/router.js";
import { errorHandle } from "./middleware/error.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(errorHandle);

export default app;
