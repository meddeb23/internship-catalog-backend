import User from "./UserModel";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "admin" })
class Admin extends Model<Admin> {
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
  public jobTitle!: string;

  @Column
  public readonly createdAt!: Date;

  @Column
  public readonly updatedAt!: Date;
}

export default Admin;
