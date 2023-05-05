import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import Enterprise from "./Enterprise.model";
import User from "./User.model";

@Table
export class SaveCompany extends Model<SaveCompany> {
  @PrimaryKey
  @ForeignKey(() => Enterprise)
  @Column({ allowNull: false })
  companyId: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: any;

  @BelongsTo(() => Enterprise)
  company: any;
}

export default SaveCompany;
