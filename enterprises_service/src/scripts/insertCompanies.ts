import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });
import Debug from "debug";
const debug = Debug("scripts:initDB");

import { IEnterpriseRepository } from "../core";
import EnterpriseService from "../app/services/EnterpriseService";
import { EnterpriseRepository } from "../infrastructure";
import { EnterpriseModel } from "../infrastructure/model";
import connectToDB from "../database";

const enterpriseRepository: IEnterpriseRepository = new EnterpriseRepository(
  EnterpriseModel
);
const Service = new EnterpriseService(enterpriseRepository);
connectToDB(true).then(async () => {
  debug("🚚 Inserting companies into Database");
  await Service.initDbFromCrawlers();
  debug("✅ Done");
});
