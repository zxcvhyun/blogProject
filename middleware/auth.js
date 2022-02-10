import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/user.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  // Cookie
  // check the header first
  let token;
  const authHeader = req.get('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 헤더에 없다면 쿠키 확인
  if (!token) {
    token = req.cookies['token'];
  }

  if (!token) {
    return res.status(401).send(AUTH_ERROR);
  }
  // //---
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log('1번');
      return res.status(401).send(AUTH_ERROR);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      console.log('2번');
      return res.status(401).send(AUTH_ERROR);
    }

    req.userId = user.id; // req.customData
    req.token = token;
    next();
  });
};
