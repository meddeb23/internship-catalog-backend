import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "./.env") });

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  EMAIL: string;
  PASSWORD: string;
  Q_URL: string;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  EMAIL: string;
  PASSWORD: string;
  Q_URL: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    Q_URL: process.env.Q_URL,
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
