import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../../database";

type EnterpriseAttributes = {
  id: number;
  company_name: string;
  company_address: string | null;
  company_city: string | null;
  company_phone: string | null;
  company_website: string | null;
  company_logo_url: string | null;
  company_linkedin_url: string | null;
  overview: string | null;
  specialties: string | null;
  is_verified: boolean;
};

type EnterpriseCreationAttributes = Optional<EnterpriseAttributes, "id">;

class Enterprise extends Model /*<EnterpriseAttributes, EnterpriseCreationAttributes> */ {
  declare id: number;
  declare company_name: string;
  declare company_address: string | null;
  declare company_city: string | null;
  declare company_phone: string | null;
  declare company_website: string | null;
  declare company_logo_url: string | null;
  declare company_linkedin_url: string | null;
  declare overview: string | null;
  declare specialties: string | null;
  declare is_verified: boolean;
}
Enterprise.init(
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
    specialties: {
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

export default Enterprise;
