import { config } from '../config.js';
import SQ, { Sequelize } from 'sequelize';

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: 'mariadb', // 사용 db명시
  logging: false,
});

console.log(host, user);
