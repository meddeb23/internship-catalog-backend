import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import { InternshipprocessModel, ProfessorModel } from ".";

class Supervisor_choice extends Model {
  declare id: number;
  declare internshipProcess: string;
  declare supervisor: number;
}
Supervisor_choice.init(
  {
    supervisor: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: ProfessorModel,
        key: "id",
      },
    },
    intershipProcess: {
      type: DataTypes.STRING,
      references: {
        model: InternshipprocessModel,
        key: "codeSujet",
      },
    },
  },
  { sequelize, tableName: "supervisor_choice" }
);

export default Supervisor_choice;
