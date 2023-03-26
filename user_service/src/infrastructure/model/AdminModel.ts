import { DataTypes, Model } from "sequelize";
import User from "./UserModel";
import sequelize from "../../database";

class Admin extends Model {
    public id!: number;
    public userId!: number;
    public jobTitle!: string;
    public department!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Admin.init(
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
      jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'admin',
    },
  );

  export default Admin
