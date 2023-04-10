import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });
import Debug from "debug";
const debug = Debug("scripts:initDB");

import { EnterpriseService } from "../app";
import { IEnterpriseRepository } from "../core";
import sequelize from "../database";
import { EnterpriseRepository } from "../infrastructure";

const enterpriseRepository: IEnterpriseRepository = new EnterpriseRepository();
const Service = new EnterpriseService(enterpriseRepository);
(async function () {
  await sequelize.sync({ force: true });
})().then(async () => {
  debug("🚚 Inserting companies into Database");
  await Service.initDbFromCrawlers();
  debug("✅ Done");
});
