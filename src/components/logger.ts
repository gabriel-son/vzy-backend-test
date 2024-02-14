import winston from "winston";

const { createLogger, format } = winston;

const transports: any = [
	new winston.transports.Console({
		level: "debug",
		handleExceptions: true,
		format: format.combine(format.errors({ stack: true }), format.colorize(), format.simple()),
		silent: false,
	}),
];

const Logger = createLogger({ transports });

export { Logger };
