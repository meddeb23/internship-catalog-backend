import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class Enterprise extends Model<Enterprise> {
  @Column
  company_name: string;

  @Column
  company_address: string;

  @Column
  company_city: string;

  @Column
  company_phone: string;

  @Column
  company_website: string;

  @Column
  company_logo_url: string;

  @Column
  company_linkedin_url: string;

  @Column({ type: DataType.TEXT })
  overview: string;

  @Column({ type: DataType.TEXT })
  specialties: string;

  @Column
  is_verified: boolean;
}
export default Enterprise;
