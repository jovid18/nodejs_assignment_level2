import express from 'express';
import { prisma } from '../utils/prisma/index.js';
const router = express.Router();

//전체 조회
router.get('/', async (req, res, next) => {
  try {
    let reviewlist = await prisma.Reviews.findMany({
      select: {
        id: true,
        bookTitle: true,
        title: true,
        author: true,
        starRating: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({ data: reviewlist });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { bookTitle, title, content, starRating, author, password } =
      req.body;
    if (
      !bookTitle ||
      !title ||
      !content ||
      !starRating ||
      !author ||
      !password
    ) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    if (!(starRating >= 1 && starRating <= 10)) {
      return res
        .status(400)
        .json({ message: '별점은 1점에서 10점까지만 입력할 수 있습니다' });
    }
    const reviews = await prisma.Reviews.create({
      data: {
        bookTitle,
        title,
        content,
        starRating,
        author,
        password,
      },
    });
    return res.status(200).json({ message: '첵 리뷰를 등록하였습니다' });
  } catch (error) {
    next(error);
  }
});

//상세조회
router.get('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let reviewOne = await prisma.Reviews.findFirst({
      where: { id: +id },
      select: {
        id: true,
        bookTitle: true,
        title: true,
        content: true,
        author: true,
        starRating: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({ data: reviewOne });
  } catch (error) {
    next(error);
  }
});

//리뷰 아이디 받아 수정
router.put('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    const { bookTitle, title, content, starRating, password } = req.body;
    if (!id || !bookTitle || !title || !content || !starRating || !password) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    if (!(starRating >= 1 && starRating <= 10)) {
      return res
        .status(400)
        .json({ message: '별점은 1점에서 10점까지만 입력할 수 있습니다' });
    }
    const review = await prisma.Reviews.findUnique({
      where: { id: +id },
    });
    if (!review)
      return res.status(404).json({ message: '존재하지 않는 리뷰입니다' });
    else if (review.password != password) {
      return res.status(404).json({ message: ' 비밀번호가 틀립니다' });
    }

    await prisma.Reviews.update({
      data: { bookTitle, title, content, starRating },
      where: {
        id: +id,
        password,
      },
    });
    return res.status(200).json({ message: '책 리뷰를 수정하였습니다' });
  } catch (error) {
    next(error);
  }
});

//리뷰삭제
router.delete('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    const { password } = req.body;
    if (!id || !password) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    const review = await prisma.Reviews.findUnique({
      where: { id: +id },
    });
    if (!review)
      return res.status(404).json({ message: '존재하지 않는 리뷰입니다' });
    else if (review.password != password) {
      return res.status(404).json({ message: ' 비밀번호가 틀립니다' });
    }
    await prisma.Reviews.delete({ where: { id: +id } });
    return res.status(200).json({ message: '책 리뷰를 삭제하였습니다.' });
  } catch (error) {
    next(error);
  }
});

export default router;
