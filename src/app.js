import express from 'express';
import dotenv from 'dotenv';
import CommentsRouter from "./routes/comments.router.js";
import ReviewsRouter from "./routes/reviews.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', CommentsRouter);
app.use('/api', ReviewsRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
