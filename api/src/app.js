import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import { errorHandle } from './middleware/error.js';

const app = express();

/* ===== CORS（必须在最前） ===== */
const corsOptions = {
  origin: ['https://demo-pi-plum-86.vercel.app', 'http://localhost:5173'],
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
