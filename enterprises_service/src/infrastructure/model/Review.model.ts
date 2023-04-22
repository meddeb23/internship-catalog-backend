// import { Model, Optional, DataTypes } from "sequelize";
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import Enterprise from "./Enterprise.model";
import User from "./User.model";

@Table
export class Review extends Model<Review> {
  @Column
  rating: number;

  @Column
  content: string;

  @ForeignKey(() => Enterprise)
  @Column({ allowNull: false })
  companyId: number;

  @BelongsTo(() => Enterprise)
  company: Enterprise;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: any;
}

export default Review;
