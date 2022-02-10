import * as userRepository from '../data/user.js';
import * as boardRepository from '../data/board.js';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';
export async function login(req, res) {
  console.log(req.body);
  const { email, password } = req.body;
  const admin = await userRepository.findByUseremail(email);

  if (admin.email !== config.admin.user) {
    return res.status(401).send({ message: 'Your not Admin' });
  }
  if (admin.password !== password) {
    return res.status(401).send({ message: 'Invalid Password' });
  }
  console.log(admin);
  const token = createJwtToken(admin.email);
  setToken(res, token);
  res.status(200).send({ email: admin.email });
}

function setToken(res, token) {
  //헤더의 쿠키에 저장
  const options = {
    maxAge: config.jwt.expiresInSec * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };
  res.cookie('token', token, options);
}
function createJwtToken(email) {
  return jwt.sign({ email }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function getUserList(req, res) {
  const users = await userRepository.getAllUser();
  res.status(200).send(users);
}

export async function removeUser(req, res) {
  const user_id = req.params.id;
  const user = await userRepository.findById(user_id);
  console.log(user);
  if (!user) {
    return res.status(404).send({ success: false });
  }
  await userRepository.remove(user_id);
  res.sendStatus(204);
}
// 게시글 상세
export async function getBoard(req, res) {
  const id = req.params.id;
  const board = await boardRepository.getById(id);
  if (board) {
    res.status(200).send(board);
  } else {
    res.status(404).send({ message: `Post id ${id} is not Found` });
  }
}

// 게시글 삭제
export async function deleteBoard(req, res) {
  const board_id = req.params.id;
  const board = await boardRepository.getById(board_id);
  if (!board) {
    return res.status(404).send({ message: '존재하지 않는 게시글 입니다.' });
  }

  await boardRepository.remove(board_id);
  res.sendStatus(204);
}

// 게시글 수정
export async function updateBoard(req, res) {
  // const id = req.params.id;
  const { board_id, title, contents } = req.body;
  const board = await boardRepository.getById(board_id);
  console.log('controller');
  console.log(board);
  if (!board) {
    return res.status(404).send({ message: `해당 게시글이 존재하지 않습니다 ${id}` });
  }
  // if (board.user_id !== req.userId) {
  //   return res.status(403).send({ message: `작성자만 수정할 수 있습니다. ` });
  // }
  const updated = await boardRepository.update(board_id, title, contents);
  res.status(201).send(updated);
}

//게시글 이미지 삭제
export async function deleteImage(req, res) {
  const board_id = req.params.id;
  const board = await boardRepository.getById(board_id);
  if (!board) {
    return res.sendstatus(404);
  }
  const image = '';
  const second_image = '';
  const updated = await boardRepository.imageRemove(board_id, image, second_image);
  res.status(201).send(updated);
}
// 게시물 order_no 변경
export async function changeOrder(req, res) {
  const board_id = req.params.id;
  const { order_no, next_order } = req.body;
  const board = await boardRepository.getById(board_id);
  if (!board) {
    return res.sendStatus(404);
  }
  const updated = await boardRepository.changeOrderNO(board_id, order_no, next_order);

  res.status(201).send(updated);
}
