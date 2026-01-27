import express from "express";
import cors from "cors";
import router from "./routes/router.js";
import { errorHandle } from "./middleware/error.js";

const app = express();

/* ===== CORS（必须在最前） ===== */
app.use(
  cors({
    origin: "https://你的-vercel-域名.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

/* ===== 关键：显式兜 OPTIONS ===== */
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

/* ===== error 永远最后 ===== */
app.use(errorHandle);

export default app;
