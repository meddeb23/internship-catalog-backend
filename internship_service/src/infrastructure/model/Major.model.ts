import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({ tableName: "majors" })
class Major extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  public name!: string;

  @Column
  public readonly createdAt!: Date;

  @Column
  public readonly updatedAt!: Date;
}

export default Major;
