import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../../database";

type UserAttributes = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  verification_number: String;
  verification_expiration_date: Date;
  email_verification_status: boolean;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

class User extends Model /*<UserAttributes, UserCreationAttributes> */ {
  declare id: number;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare password: string;
  declare verification_number: string;
  declare verification_expiration_date: string;
  declare email_verification_status: boolean;
  declare registration_completed: boolean;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.CHAR,
    },
    registration_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, tableName: "users" }
);

export default User;
