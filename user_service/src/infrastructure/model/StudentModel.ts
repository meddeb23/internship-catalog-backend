import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import User from "./UserModel";
import Major from "./Major.model";

@Table({ tableName: "student" })
class Student extends Model<Student> {
  @Column({ primaryKey: true, autoIncrement: true })
  public id: number;

  @Column({ allowNull: true })
  public address: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER.UNSIGNED)
  public userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Major)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  public majorId: number;

  @BelongsTo(() => Major)
  public major: Major;
}

export default Student;
