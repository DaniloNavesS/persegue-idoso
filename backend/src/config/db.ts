import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'sistema-idoso',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'admin',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: +(process.env.DB_PORT || 5432),
    logging: false
  }
);