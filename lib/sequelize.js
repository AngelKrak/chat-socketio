import { Sequelize } from 'sequelize';
// import { SqliteDialect } from '@sequelize/sqlite3';

const sequelize = new Sequelize({
  // dialect: SqliteDialect,
  dialect: 'sqlite',
  storage: 'database.sqlite',
});
// const sequelize = new Sequelize('sqlite::memory:');

export default sequelize;
