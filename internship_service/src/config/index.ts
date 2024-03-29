import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "./.env") });

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  DB_LOGS: boolean | undefined;
  isDevMode: boolean;
  secret: string;
  // Q_URL: string;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  DB_LOGS: boolean;
  isDevMode: boolean;
  secret: string;
  //Q_URL: string;
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV || "developement",
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    DB_LOGS: process.env.DB_LOGS === "true" ? true : false,
    isDevMode: process.env.NODE_ENV === "production" ? false : true,
    secret: process.env.SECRET || "some_random",
    // Q_URL: process.env.Q_URL,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
