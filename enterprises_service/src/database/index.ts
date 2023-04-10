import { Sequelize } from "sequelize";

console.log(process.env.DB_HOST);

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
});

export default sequelize;
