import { DataTypes, Model } from "sequelize";
import User from "./UserModel";
import sequelize from "../../database";

class Student extends Model {
    public id!: number;
    public userId!: number;
    public address!: string;
    public major!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Student.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: User,
          key: 'id',
        },
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      major: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'student',
    },
  );

export default Student
