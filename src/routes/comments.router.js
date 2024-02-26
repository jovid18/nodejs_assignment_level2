import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.post('/reviews/:reviewId/comments', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId, content, authro, password 받아오기
  const { reviewId } = req.params;
  const { content, author, password } = req.body;
  //댓글 내용이 존재하지 않을 경우
  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }
  //reviewId에 해당하는 리뷰 검색
  const review = await prisma.reviews.findUnique({
    where: {
      id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //reviewId에 해당하는 리뷰에 댓글 등록
  await prisma.comments.create({
    data: {
      content,
      author,
      password,
      review_id: +reviewId,
    },
  });
  res.status(201).json({ message: '댓글을 등록하였습니다.' });
});

router.get('/reviews/:reviewId/comments', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId 받아오기
  const { reviewId } = req.params;
  //reviewId에 해당하는 리뷰 검색
  const review = await prisma.reviews.findUnique({
    where: {
      id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //reviewId에 해당하는 리뷰의 댓글 목록 조회
  const comments = await prisma.comments.findMany({
    where: {
      review_id: +reviewId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({ data: comments });
});

router.put('/reviews/:reviewId/comments/:commentId', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId, commentId, content, password 받아오기
  const { reviewId, commentId } = req.params;
  const { content, password } = req.body;
  const review = await prisma.reviews.findUnique({
    where: {
      id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //댓글 내용이 존재하지 않을 경우
  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }
  //reviewId와 comment id에 해당하는 리뷰 검색
  const comment = await prisma.comments.findUnique({
    where: {
      review_id: +reviewId,
      id: +commentId,
    },
  });
  if (!comment)
    return res.status(404).json({ message: '존재하지 않는 댓글입니다.' });
  //댓글의 비밀번호가 일치하지 않을 경우
  if (comment.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
  //reviewId에 해당하는 리뷰의 댓글 수정
  await prisma.comments.update({
    where: {
      review_id: +reviewId,
      id: +commentId,
    },
    data: {
      content,
    },
  });
  res.status(200).json({ message: '댓글을 수정하였습니다.' });
});

router.delete(
  '/reviews/:reviewId/comments/:commentId',
  async (req, res, next) => {
    // body 또는 params를 입력받지 못한 경우
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    //reviewId, commentId, password 받아오기
    const { reviewId, commentId } = req.params;
    const { password } = req.body;
    //reviewId에 해당하는 리뷰 검색
    const review = await prisma.reviews.findUnique({
      where: {
        id: +reviewId,
      },
    });
    //reviewId에 해당하는 리뷰가 존재하지 않을 경우
    if (!review) {
      return res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
    }
    //reviewId와 commentId에 해당하는 리뷰의 댓글 검색
    const comment = await prisma.comments.findUnique({
      where: {
        review_id: +reviewId,
        id: +commentId,
      },
    });
    if (!comment)
      return res.status(404).json({ message: '존재하지 않는 댓글입니다.' });
    //댓글의 비밀번호가 일치하지 않을 경우
    if (comment.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    //reviewId에 해당하는 리뷰의 댓글 삭제
    await prisma.comments.delete({
      where: {
        review_id: +reviewId,
        id: +commentId,
      },
    });
    return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  }
);

export default router;
