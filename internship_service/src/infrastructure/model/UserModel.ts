import { Model, DataTypes } from "sequelize";
import { Roles } from "../../core/entities";
import sequelize from "../database";

class User extends Model {
  public id: number;
  public first_name: string;
  public last_name: string;
  public email: string;
  public password: string;
  public registration_completed: boolean;
  public role: Roles;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public validateRole(value: string): void {
    if (!Object.values(Roles).includes(value as Roles)) {
      throw new Error(
        'Role should be either "student" or "admin" or professor'
      );
    }
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: Roles.Student,
      validate: {
        validateRole(value: string): void {
          this.validateRole(value);
        },
      },
    },
    registration_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, tableName: "users" }
);

export default User;
