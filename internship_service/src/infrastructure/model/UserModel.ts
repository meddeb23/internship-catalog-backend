import { Roles } from "../../core/entities";
import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  Is,
  Model,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from "sequelize-typescript";

@Table({ tableName: "users" })
class User extends Model<User> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER.UNSIGNED)
  public id!: number;

  @Column(DataType.STRING(50))
  public first_name?: string;

  @Column(DataType.STRING(50))
  public last_name?: string;

  @Unique
  @Column(DataType.STRING(150))
  public email!: string;

  @Column(DataType.STRING(100))
  public password?: string;

  @Default(Roles.Student)
  @Is("UserRole", (value: string) => {
    if (!Object.values(Roles).includes(value as Roles)) {
      throw new Error(
        'Role should be either "student" or "admin" or "professor"'
      );
    }
  })
  @Column(DataType.STRING(10))
  public role!: Roles;

  @Default(false)
  @Column(DataType.BOOLEAN)
  public registration_completed!: boolean;

  @Column
  public readonly createdAt!: Date;

  @Column
  public readonly updatedAt!: Date;
}
export default User;
