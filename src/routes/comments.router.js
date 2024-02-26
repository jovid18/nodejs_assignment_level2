import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

//댓글 등록 API
// POST /api/reviews/:reviewId/comments
// request body : {
//   "content": "영상미는 좋았다.",
//   "author":"댓글 작성자",
//   "password":"1234"
// }
// response body : {{
// "message": "댓글을 등록하였습니다."
// }
// error response
// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 reviewId에 해당하는 리뷰가 존재하지 않을 경우
// { message: 존재하지 않는 리뷰입니다. }
// # 400 댓글 내용이 존재하지 않을 경우
// { message: 댓글 내용을 입력해주세요.}

router.post('/reviews/:reviewId/comments', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId, content, authro, password 받아오기
  const { reviewId } = req.params;
  const { content, author, password } = req.body;
  //댓글 내용이 존재하지 않을 경우
  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }
  //reviewId에 해당하는 리뷰 검색
  const review = await prisma.reviews.findUnique({
    where: {
      review_id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //reviewId에 해당하는 리뷰에 댓글 등록
  await prisma.comments.create({
    data: {
      content,
      author,
      password,
      review_Id: +reviewId,
    },
  });
  res.status(201).json({ message: '댓글을 등록하였습니다.' });
});

//댓글 목록 조회 API
// GET /api/reviews/:reviewId/comments
// request body : {}
// response body : {
// "data": [
//     {
//     "id": 3,
//     "content": "영상미는 좋았다.",
//     "createdAt": "2023-10-15T08:46:18.673Z",
//     "updatedAt": "2023-10-15T08:46:18.673Z"
//     },
//     {
//     "id": 2,
//     "content": "영상미는 좋았었나?",
//     "createdAt": "2023-10-15T08:46:18.329Z",
//     "updatedAt": "2023-10-15T08:52:06.001Z"
//     },
//     {
//     "id": 1,
//     "content": "영상미는 좋았다.",
//     "createdAt": "2023-10-15T08:46:15.112Z",
//     "updatedAt": "2023-10-15T08:46:15.112Z"
//     }
//     ]
//     }
// error response
// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 reviewId에 해당하는 리뷰가 존재하지 않을 경우
// { message: 존재하지 않는 리뷰입니다. }
router.get('/reviews/:reviewId/comments', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId 받아오기
  const { reviewId } = req.params;
  //reviewId에 해당하는 리뷰 검색
  const review = await prisma.reviews.findUnique({
    where: {
      review_id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //reviewId에 해당하는 리뷰의 댓글 목록 조회
  const comments = await prisma.comments.findMany({
    where: {
      review_id: +reviewId,
    },
    sort: {
      createdAt: 'desc',
    },
  });
  res.status(200).json({ data: comments });
});

//댓글 수정 API
// PUT /api/reviews/:reviewId/comments/:commentId
// request body : {
//   "content": "영상미는 좋았었나?",
//   "password":"1234"
// }
// response body : {
//   "message": "댓글을 수정하였습니다."
// }
// error response:
// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 reviewId에 해당하는 리뷰가 존재하지 않을 경우
// { message: 존재하지 않는 리뷰입니다. }
// # 400 댓글 내용이 존재하지 않을 경우
// { message: 댓글 내용을 입력해주세요.}
// # 401 댓글의 비밀번호가 일치하지 않을 경우
// { message: 비밀번호가 일치하지 않습니다.}
router.put('/reviews/:reviewId/comments/:commentId', async (req, res, next) => {
  // body 또는 params를 입력받지 못한 경우
  if (!req.body || !req.params) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
  //reviewId, commentId, content, password 받아오기
  const { reviewId, commentId } = req.params;
  const { content, password } = req.body;
  const review = await prisma.reviews.findOne({
    where: {
      review_id: +reviewId,
    },
  });
  //reviewId에 해당하는 리뷰가 존재하지 않을 경우
  if (!review) {
    res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  //댓글 내용이 존재하지 않을 경우
  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }
  //reviewId에 해당하는 리뷰 검색
  const comment = await prisma.comments.findUnique({
    where: {
      review_id: +reviewId,
      comment_id: +commentId,
    },
  });
  //댓글의 비밀번호가 일치하지 않을 경우
  if (comment.password !== password) {
    res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
  //reviewId에 해당하는 리뷰의 댓글 수정
  await prisma.comments.update({
    where: {
      review_id: +reviewId,
      comment_id: +commentId,
    },
    data: {
      content,
    },
  });
  res.status(200).json({ message: '댓글을 수정하였습니다.' });
});

//댓글 삭제 API
// DELETE /api/reviews/:reviewId/comments/:commentId
// request body : {
//   "password": "1234"
// }
// response body :{
//   "message": "댓글을 삭제하였습니다."
// }
// error response:
// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 reviewId에 해당하는 리뷰가 존재하지 않을 경우
// { message: 존재하지 않는 리뷰입니다. }
// # 401 댓글의 비밀번호가 일치하지 않을 경우
// { message: 비밀번호가 일치하지 않습니다.}
router.delete(
  '/reviews/:reviewId/comments/:commentId',
  async (req, res, next) => {
    // body 또는 params를 입력받지 못한 경우
    if (!req.body || !req.params) {
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    //reviewId, commentId, password 받아오기
    const { reviewId, commentId } = req.params;
    const { password } = req.body;
    //reviewId에 해당하는 리뷰 검색
    const review = await prisma.reviews.findUnique({
      where: {
        review_id: +reviewId,
      },
    });
    //reviewId에 해당하는 리뷰가 존재하지 않을 경우
    if (!review) {
      res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
    }
    //reviewId에 해당하는 리뷰의 댓글 검색
    const comment = await prisma.comments.findUnique({
      where: {
        review_id: +reviewId,
        comment_id: +commentId,
      },
    });
    //댓글의 비밀번호가 일치하지 않을 경우
    if (comment.password !== password) {
      res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    //reviewId에 해당하는 리뷰의 댓글 삭제
    await prisma.comments.delete({
      where: {
        review_id: +reviewId,
        comment_id: +commentId,
      },
    });
    return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  }
);

export default router;
