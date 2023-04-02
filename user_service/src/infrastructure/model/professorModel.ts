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
    tableName: "professor",
  }
);

Professor.belongsTo(User);
User.hasOne(Professor);

export default Professor;
