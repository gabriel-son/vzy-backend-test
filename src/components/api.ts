import { AppError, ServerError, ValidationError, UnauthorizedError } from "@components/errors";
import { Logger } from "@components/logger";
import express from "express";
import { PathParams } from "express-serve-static-core";
import { ValidationChain, validationResult, matchedData } from "express-validator";
import { App } from "@config/index";

export type SupportedHttpMethods = "get" | "post" | "put" | "patch" | "delete" | "head" | "trace" | "all";

export enum ErrorTypes {
	DUPLICATE = "duplicateField",
	INVALID = "invalidField",
	REQUIRED = "requiredField",
	DEFAULT = "failedValidation",
	AUTH = "authenication",
}

export type MiddlewareSignature = (req: express.Request, res: express.Response, next: express.NextFunction) => any;

export type SubRouter = [PathParams, express.Router];

export type RequestHandler = [PathParams, MiddlewareSignature | MiddlewareSignature[], ValidationChain[] | ValidatorDefinition, any];

export type HttpHandlers = RequestHandler[];

export interface SubRouterMount {
	use?: SubRouter[];
}

export type RouterDefinition = { [k in SupportedHttpMethods]?: HttpHandlers } & SubRouterMount;

export interface ValidatorOptions {
	onlyValidData?: boolean;
}

export interface ValidatorDefinition {
	validators: ValidationChain[];
	options?: ValidatorOptions;
}

export const isRouter = (router: any) => {
	const proto = Object.getPrototypeOf(router);
	return proto === express.Router;
};

export class ApiResponse {
	public code = 200;
	public message = "";
	public data?: any;
	constructor(data?: any, message?: string, code?: number) {
		if (data) {
			this.data = data;
		}
		if (message) {
			this.message = message;
		}
		if (code) {
			this.code = code;
		}
	}
}

export const validateRequest = (req: express.Request, options: Partial<ValidatorOptions> = {}) => {
	const errorFormatter = ({ msg, param, type }: any) => {
		return {
			parameter: param,
			message: msg,
			type,
		};
	};
	const errors = validationResult(req).formatWith(errorFormatter);
	if (!errors.isEmpty()) {
		const error = errors.array({ onlyFirstError: true })[0];
		const errorMsg = error.message.split("~");
		if (errorMsg.length > 1) {
			error.type = errorMsg[1];
			error.message = errorMsg[0];
		} else {
			error.type = ErrorTypes.DEFAULT;
		}
		if (error.type === ErrorTypes.AUTH) {
			App.ErrorHandler.handle(new UnauthorizedError(error.message).setInfo({ validationFailed: true, error: error }).setFields(req.body));

			throw new UnauthorizedError(error.message).setInfo({ validationFailed: true, error: error }).setFields(req.body);
		} else {
			App.ErrorHandler.handle(new ValidationError().setInfo({ validationFailed: true, error: error }).setFields(req.body));
			throw new ValidationError().setInfo({ validationFailed: true, error: error }).setFields(req.body);
		}
	}
	const data = matchedData(req, {
		onlyValidData: options.onlyValidData || true,
	});
	Logger.info("Request Validated Data ", data);
	return data;
};

export const restFacade = (requestHandler: (req: any, res: any, next?: any) => void) => {
	const wrapped = async (req: express.Request, res: express.Response, next: any) => {
		try {
			await requestHandler(req, res, next);
		} catch (caught) {
			const error = caught instanceof AppError ? caught : new ServerError(caught as any);
			error.setClient((req as any).client || {});
			if (!res.headersSent) {
				res.status(error.httpCode).json(new ApiResponse(error.info, error.message, error.httpCode));
			}
			Logger.error("BUBBLED ERROR: ", caught);
		}
	};
	return wrapped;
};

export const defaultRequestHandler = (controllerFn: any, options: Partial<ValidatorOptions> = {}) => {
	const defaultOptions: Partial<ValidatorOptions> = {
		onlyValidData: true,
	};
	const handler = async (req: express.Request, res: express.Response) => {
		try {
			const data = validateRequest(req, { ...defaultOptions, ...options });
			const result = await controllerFn(data, (req as any).user);
			const response = new ApiResponse(result.data, result.message || "Request successful", result.code);
			res.status(response.code).json(response);
		} catch (error) {
			throw error;
		}
	};
	return handler;
};

export const load = (definition: RouterDefinition) => {
	const router = express.Router();
	for (const [method, routes] of Object.entries(definition)) {
		for (const route of routes as Required<HttpHandlers>) {
			if (method === "use") {
				router.use(route[0], route[1] as unknown as express.Router);
			} else {
				let options = {};
				const [path, middlewares, validators, controller] = route as RequestHandler;
				const handlers: (MiddlewareSignature | ValidationChain)[] = [];
				if (Array.isArray(middlewares)) {
					handlers.push(...middlewares);
				} else {
					handlers.push(middlewares);
				}
				if (Array.isArray(validators)) {
					handlers.push(...validators);
				} else {
					handlers.push(...validators.validators);
					options = validators.options || {};
				}
				handlers.push(restFacade(defaultRequestHandler(controller, options)));
				(router as any)[method](path, handlers);
			}
		}
	}
	return router;
};

export function generateInterface<T>(properties: T): T {
	return properties;
}
