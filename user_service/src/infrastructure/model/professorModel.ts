import { DataTypes, Model } from "sequelize";
import User from "./UserModel";
import sequelize from "../../database";

class Professor extends Model {
    public id!: number;
    public userId!: number;
    public department!: string;
    public officeLocation!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Professor.init(
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
      department: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      officeLocation: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'professor',
    },
  );

export default Professor