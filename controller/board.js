import * as boardRepository from '../data/board.js';

// 전체 게시글 목록
export async function getBoards(req, res) {
  const nickname = req.query.nickname;
  const data = await (nickname
    ? boardRepository.getAllByUsernickname(nickname)
    : boardRepository.getAll());
  res.status(200).send(data);
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

// 게시글 작성
export async function createBoard(req, res) {
  const { title, image, contents } = req.body;
  console.log(`boardController ${img}`);
  const board = await boardRepository.create(title, image, contents, req.userId);
  if (board) {
    res.status(201).send({ board });
  } else {
    res.status(404).send({ message: `Server is not response` });
  }
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
  if (board.user_id !== req.userId) {
    return res.status(403).send({ message: `작성자만 수정할 수 있습니다. ` });
  }
  const updated = await boardRepository.update(board_id, title, contents);
  res.status(201).send(updated);
}

// 게시글 삭제
export async function deleteBoard(req, res) {
  const board_id = req.params.id;
  const board = await boardRepository.getById(board_id);
  if (!board) {
    return res.status(404).send({ message: '존재하지 않는 게시글 입니다.' });
  }
  if (board.user_id !== req.userId) {
    return res.sendStatus(403);
  }
  await boardRepository.remove(board_id);
  res.sendStatus(204);
}
