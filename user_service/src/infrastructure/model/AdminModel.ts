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
    tableName: "admin",
  }
);

Admin.belongsTo(User);
User.hasOne(Admin);

export default Admin;
