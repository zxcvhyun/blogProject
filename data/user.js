import { sequelize } from '../db/database.js';
import SQ from 'sequelize';
import { Op } from 'sequelize';

const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export async function findByUseremail(email) {
  return User.findOne({ where: { email: email } });
}

export async function findById(id) {
  return User.findByPk(id);
}

export async function createUser(user) {
  return User.create(user).then((data) => {
    console.log(data.dataValues.id);
    return data;
  });
}

// admin
export async function getAllUser() {
  return User.findAll({
    attributes: ['id', 'email', 'nickname', 'create_at'],
    where: {
      email: { [Op.notIn]: ['admin'] },
    },
  });
}

export async function remove(user_id) {
  return User.findByPk(user_id).then((user) => {
    user.destroy();
  });
}
