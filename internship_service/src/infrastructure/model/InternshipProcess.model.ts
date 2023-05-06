import {
  AllowNull,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./UserModel";
import Enterprise from "./Enterprise.model";
import SupervisorChoice from "./ChoiceModel";

@Table
class InternshipProcess extends Model<InternshipProcess> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  public studentId: number;

  @ForeignKey(() => Enterprise)
  @AllowNull(false)
  @Column
  public companyId: number;

  @AllowNull(false)
  @Column
  public department: string;

  @AllowNull(false)
  @Column
  public companySupervisorName: string;

  @AllowNull(false)
  @Column
  public companySupervisorAddress: string;

  @AllowNull(false)
  @Column
  public companySupervisorPhone: string;

  @Column
  public chosenSupervisorId: number;

  @HasMany(() => SupervisorChoice)
  public SupervisorChoice: SupervisorChoice[];
}

export default InternshipProcess;
