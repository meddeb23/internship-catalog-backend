import User from "./UserModel";
import sequelize from "../database";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "professor" })
class Professor extends Model<Professor> {
  @Column({ primaryKey: true, autoIncrement: true })
  public id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER.UNSIGNED)
  public userId!: number;

  @BelongsTo(() => User)
  public user: User;

  @Column({ type: DataType.STRING(100) })
  public department!: string;

  @Column({ type: DataType.STRING(100) })
  public officeLocation!: string;

  @Column
  public readonly createdAt!: Date;

  @Column
  public readonly updatedAt!: Date;
}

export default Professor;
