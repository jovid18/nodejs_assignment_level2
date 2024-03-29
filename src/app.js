import express from 'express';
import dotenv from 'dotenv';
import CommentsRouter from './routes/comments.router.js';
import ReviewsRouter from './routes/reviews.router.js';
import notFoundErrorHandler from '../middlewares/notFoundError.middleware.js';
import generalErrorHandler from '../middlewares/generalError.middleware.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/reviews', ReviewsRouter);
app.use('/api', CommentsRouter);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
