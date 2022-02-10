import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/user.js';
import { config } from '../config.js';

export async function signup(req, res) {
  const { email, password, nickname } = req.body;
  const found = await userRepository.findByUseremail(email);
  if (found) {
    return res.status(409).send({ message: `${email} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    email,
    password: hashed,
    nickname,
    create_at: Date.now(),
  });
  const token = createJwtToken(userId);
  setToken(res, token);
  res.status(201).send({ token, email });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userRepository.findByUseremail(email);
  if (!user) {
    return res.status(401).send({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).send({ message: 'Invalid password' });
  }

  const token = createJwtToken(user.id);
  setToken(res, token);
  res.status(200).send({ token, email: user.email, nickname: user.nickname });
  console.log(email);
}

export async function logout(req, res, next) {
  console.log('logout');
  res.clearCookie('token');
  res.status(200).send({ message: 'Complete logout' });
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

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);

  if (!user) {
    return await res.status(404).send({ message: 'User Not Found' });
  }
  res.status(200).send({ token: req.token, email: user.email });
}
