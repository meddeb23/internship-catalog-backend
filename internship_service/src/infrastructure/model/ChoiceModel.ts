import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InternshipProcess from "./InternshipProcess.model";
import Professor from "./professorModel";

@Table
class SupervisorChoice extends Model<SupervisorChoice> {
  @PrimaryKey
  @ForeignKey(() => InternshipProcess)
  @Column
  public internshipProcess: number;

  @PrimaryKey
  @ForeignKey(() => Professor)
  @Column
  public supervisorId: number;

  @BelongsTo(() => Professor)
  public professor: Professor;
}

export default SupervisorChoice;
