import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/infrastructure/database/internshipProcess.db",
  logging: false,
});

export default sequelize;
