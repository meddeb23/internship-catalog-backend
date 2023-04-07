import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class TechnicalDomain extends Model {
  declare id: number;
  declare name: String;
}
TechnicalDomain.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "domain" }
);

export default TechnicalDomain;
