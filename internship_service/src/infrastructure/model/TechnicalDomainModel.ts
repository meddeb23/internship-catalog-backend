import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
class TechnicalDomain extends Model<TechnicalDomain> {
  @PrimaryKey
  @Column
  public id: number;

  @Column
  public name: String;
}

export default TechnicalDomain;
