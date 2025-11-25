"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'sistema-idoso', process.env.DB_USER || 'admin', process.env.DB_PASSWORD || 'admin', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: +(process.env.DB_PORT || 5432),
    logging: false
});
