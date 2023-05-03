class Major {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    name: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Major;
