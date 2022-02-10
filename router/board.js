import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as boardController from '../controller/board.js';
import * as boardRepository from '../data/board.js';
import { isAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const validateBoard = [
  body('contents')
    .trim()
    .isLength({ min: 3 })
    .withMessage('contents should be at least 3 characters'),
  validate,
];

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
});

router.get('/', boardController.getBoards);
router.get('/board', boardController.getBoards);
router.get('/:id', isAuth, boardController.getBoard);
router.put('/modify/:id', isAuth, boardController.updateBoard);
router.delete('/delete/:id', isAuth, boardController.deleteBoard);

router.post('/post', isAuth, upload.array('image', 2), async (req, res, next) => {
  const { title, contents } = req.body;
  console.log(req.files);
  let img = '';
  let second_image = '';
  if (req.files[0] != null) {
    img = `/uploads/${req.files[0].filename}`;
  }
  if (req.files[1] != null) {
    second_image = `/uploads/${req.files[1].filename}`;
  }
  console.log(second_image);
  const board = await boardRepository.create(
    title,
    img,
    contents,
    req.userId,
    second_image
  );
  if (board) {
    res.status(201).send({ board });
  } else {
    res.status(404).send({ message: `Server is not response` });
  }
});

export default router;
