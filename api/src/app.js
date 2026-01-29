import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import { errorHandle } from './middleware/error.js';

const app = express();

/* ===== CORS（必须在最前） ===== */
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',') // 分割字符串
  .map((o) => o.trim()) // 去除每个域名的空格
  .filter(Boolean); // 移除空字符串
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

/* ===== error 永远最后 ===== */
app.use(errorHandle);

export default app;
