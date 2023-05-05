// import { Sequelize } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
  EnterpriseModel,
  LikeCompanyModel,
  ReviewsModel,
  SaveCompanyModel,
  UserModel,
} from "../infrastructure/model";

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
});

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));
export const sequelizeModel = sequelize;
async function connectToDB(force: boolean = false) {
  sequelize.addModels([
    EnterpriseModel,
    ReviewsModel,
    UserModel,
    LikeCompanyModel,
    SaveCompanyModel,
  ]);
  EnterpriseModel.sync({ force });
  ReviewsModel.sync({ force: false });
  LikeCompanyModel.sync({ force: false });
  SaveCompanyModel.sync({ force: false });
  // await sequelize.sync({ force });
}
export default connectToDB;
