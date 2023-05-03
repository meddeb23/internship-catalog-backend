import { Sequelize } from "sequelize-typescript";
import {
  AdminModel,
  MajorModel,
  ProfessorModel,
  StudentModel,
  UserModel,
} from "../model";

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
});
async function connectToDB(force: boolean = false) {
  sequelize.addModels([
    UserModel,
    StudentModel,
    ProfessorModel,
    AdminModel,
    MajorModel,
  ]);
  await sequelize.sync({ force });
}
export default connectToDB;
// export default sequelize;
