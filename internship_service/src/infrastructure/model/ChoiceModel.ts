import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Supervisor_choice extends Model {
  declare id: number;
  declare internshipProcess_id: number;
  declare supervisor_id: number;
  declare is_validated: boolean;
}
Supervisor_choice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    internshipProcess_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supervisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, tableName: "supervisor_choice" }
);

export default Supervisor_choice;
