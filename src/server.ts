import express, { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { errorHandler } from "@middlewares/index";
import routes from "@routes/index";
import { ForbiddenError } from "@components/errors";
import { App } from "@config/index";

// Stops MaxListenersExceededWarning
import EventEmitter from "events";

EventEmitter.defaultMaxListeners = 0;
// Limit request from same IP
const limiter = rateLimit({
	limit: App.prod ? 1000 : 10000000,
	windowMs: 60 * 60 * 100,
	message: "Too many requests from this IP, please try again in an hour!",
});

// List of allowed urls to make request to server
const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000"];
const corsHeaders = [
	"Origin",
	"Accept",
	"Authorization",
	"DNT",
	"X-Mx-ReqToken",
	"Keep-Alive",
	"User-Agent",
	"X-Requested-With",
	"If-Modified-Since",
	"Cache-Control",
	"Content-Type",
	"secret",
	"API-Token",
	"API-Token-Expiry",
	"token",
];

const corsOptions = {
	origin: function (origin: string, callback: (error: any, valied?: boolean) => any) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new ForbiddenError("Access not granted"));
		}
	},
	methods: "GET,POST,PUT,PATCH,DELETE",
	credentials: true,
	allowedHeaders: corsHeaders,
	exposedHeaders: corsHeaders,
};

const v1 = "/v1";

const app = express();

app.use(limiter);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions as cors.CorsOptions));

app.get("/", (_: any, res: Response) => {
	res.send("Welcome to VZY Backend Test");
});

app.use(`${v1}`, routes);

app.use(errorHandler);

export default app;
