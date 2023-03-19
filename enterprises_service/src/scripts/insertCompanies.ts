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
})().then(() => {
  debug("🚚 Inserting companies into Database");
  Service.initDbFromCrawlers();
  debug("✅ Done");
});
