import { sequelize } from '../db/database.js';
import SQ from 'sequelize';
import { User } from './user.js';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Board = sequelize.define('boards', {
  id: {
    type: DataTypes.INTEGER,
    field: 'board_id',
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  contents: {
    type: DataTypes.STRING(3000),
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
  },
  order_no: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    unique: true,
  },
  second_image: {
    type: DataTypes.TEXT,
  },
});
Board.belongsTo(User, {
  foreignKey: 'user_id',
});

const INCLUDE_USER = {
  attributes: [
    'board_id',
    'title',
    'contents',
    'image',
    'order_no',
    'createdAt',
    'updatedAt',
    'second_image',
    [Sequelize.col('user.user_id'), 'user_id'],
    [Sequelize.col('user.nickname'), 'nickname'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};
const ORDER_DESC = { order: [['order_no', 'DESC']] };

export async function getAll() {
  return Board.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsernickname(nickname) {
  return Board.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { nickname: nickname },
    },
  });
}

export async function getById(id) {
  return Board.findOne({
    where: { id: id },
    ...INCLUDE_USER,
  });
}

export async function create(title, img, contents, user_id, second_image) {
  return Board.create({
    title,
    image: img,
    contents,
    user_id,
    order_no: await Board.max('order_no').then((max) => {
      return max + 1;
    }),
    second_image,
  }).then((data) => this.getById(data.dataValues.id));
}

export async function update(board_id, title, contents) {
  console.log(`boardId: ${board_id}`);
  return Board.findByPk(board_id, INCLUDE_USER).then((board) => {
    board.id = board_id;
    board.title = title;
    board.contents = contents;
    return board.save();
  });
}

export async function remove(board_id) {
  return Board.findByPk(board_id).then((board) => {
    board.destroy();
  });
}

export async function imageRemove(board_id, image, second_image) {
  return Board.findByPk(board_id).then((board) => {
    board.id = board_id;
    board.image = image;
    board.second_image = second_image;
    return board.save();
  });
}

export async function changeOrderNO(board_id, order_no, next_order) {
  Board.findOne({ where: { order_no: order_no } }).then((board) => {
    board.id = board_id;
    board.order_no = next_order;
    board.save();
  });
  Board.findOne({ where: { order_no: next_order } }).then((board) => {
    board.order_no = order_no;
    board.save();
  });

  return Board.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}
