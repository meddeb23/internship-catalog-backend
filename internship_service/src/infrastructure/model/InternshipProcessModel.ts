import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Internship_process extends Model {
  declare id: number;
  declare student_id: number;
  declare company_id: number | null;
  declare intern_department: string;
  declare intern_company_supervisor_name: string;
  declare intern_company_supervisor_address: string;
  declare intern_company_supervisor_phone: string;
  declare step: number;
}
Internship_process.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    intern_department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intern_company_supervisor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intern_company_supervisor_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intern_company_supervisor_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    step: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { sequelize, tableName: "internship_process" }
);

export default Internship_process;
