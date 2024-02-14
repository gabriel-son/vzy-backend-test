import path from "path";
import fs from "fs";
import { config as loadOverrides } from "dotenv";
import { ErrorHandler } from "@components/errors";

const ENV = process.env.NODE_ENV || "development";
const PROD = ENV === "production";
const OVERRIDE_PATH = path.resolve(__dirname, `./../../.${ENV}.env`);

if (fs.existsSync(OVERRIDE_PATH)) {
	loadOverrides({
		path: OVERRIDE_PATH,
		debug: true,
		encoding: "UTF-8",
	});
}

function getEnv<T = string>(key: string, onNotExist: any | null = null) {
	return (process.env[key] || onNotExist) as T;
}

const dbConfig = {
	MONGO_URI: getEnv<string>("MONGO_URI", "mongodb://127.0.0.1:27017/vzy-backend-test"),
};
const LOG_DIR = path.resolve(process.env.LOG_DIR || __dirname + "/../../logs");
const getLogPath = () => {
	return path.resolve(LOG_DIR, path.parse(process.env.pm_exec_path || process.argv[1]).name);
};

const Config = Object.freeze({
	App: {
		name: "vzy-backend-test",
		version: "1.0.0",
		base_url: getEnv<string>("BASE_URL", `http://127.0.0.1:${getEnv<string>("PORT", "4000")}/`),
		env: getEnv<string>("ENV", "development"),
		prod: PROD,
		debug: getEnv<string>("DATABASE_DEBUG"),
		webserver: {
			port: getEnv<string>("PORT", "4000"),
		},
		logging: {
			file: getEnv<string>("LOG_PATH", "logs/app.log"),
			level: getEnv<string>("LOG_LEVEL", "info"),
		},
		jwt_secret: getEnv<string>("JWT_SECRET"),
		jwt_expiry: getEnv<string>("JWT_EXPIRES_IN"),
		log_to_file: !!Number(getEnv<string>("ADD_FILE_LOGGING", "0")),
		log_dir: getLogPath(),
		ErrorHandler: new ErrorHandler(),
	},
	Database: {
		connection: {
			development: dbConfig,
			staging: dbConfig,
			production: dbConfig,
		},
	},

});

export = Config;
