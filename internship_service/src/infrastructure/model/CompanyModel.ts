import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../database";

class Company extends Model {
  declare id: number;
  declare company_name: string;
  declare company_address: string | null;
  declare company_city: string | null;
  declare company_phone: string | null;
  declare company_website: string | null;
  declare company_logo_url: string | null;
  declare company_linkedin_url: string | null;
  declare overview: string | null;
  // declare specialties: string | null;
  declare is_verified: boolean;
}
Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    company_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_logo_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_linkedin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, tableName: "enterprises" }
);

export default Company;
