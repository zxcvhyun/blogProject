import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import authRouter from './router/auth.js';
import boardRouter from './router/board.js';
import adminRouter from './router/admin.js';
const app = express();
const corsOption = {
  origin: true,
  credentials: true, // allow the Access-Control-Allow-Credentials
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(morgan('tiny'));

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res, next) => {
  res.send('main');
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(8080);
