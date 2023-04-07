import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import {
  Company,
  Professor,
  Student,
  SupervisorChoice,
  TechnicalDomain,
} from "../../core/entities";
import {
  ChoiceModel,
  CompanyModel,
  ProfessorModel,
  StudentModel,
  TechnicalDomainModel,
} from "./";

class InternshipProcess extends Model {
  declare codeSujet: String;
  declare studentId: number;
  declare companyId: number;
  declare department: number;
  declare companySupervisorName: string;
  declare companySupervisorAddress: string;
  declare companySupervisorPhone: string;
  declare chosenSupervisorId: number;
}

InternshipProcess.init(
  {
    codeSujet: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    companySupervisorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companySupervisorPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companySupervisorAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, tableName: "internshipProcess" }
);

// InternshipProcess.hasMany(ChoiceModel);
// ChoiceModel.belongsTo(InternshipProcess);
InternshipProcess.belongsToMany(ProfessorModel, { through: ChoiceModel });
ProfessorModel.belongsToMany(InternshipProcess, { through: ChoiceModel });

InternshipProcess.belongsTo(StudentModel);
StudentModel.hasMany(InternshipProcess);

InternshipProcess.belongsTo(TechnicalDomainModel);
TechnicalDomainModel.hasMany(InternshipProcess);

InternshipProcess.belongsTo(ProfessorModel);
ProfessorModel.hasMany(InternshipProcess);

InternshipProcess.belongsTo(CompanyModel);
CompanyModel.hasMany(InternshipProcess);

export default InternshipProcess;
