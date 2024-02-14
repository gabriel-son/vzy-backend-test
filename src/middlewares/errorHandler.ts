import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log("I AM IN HERE", err);
	// Validation errors from express-validator
	if (err && err.array) {
		const errors = err.array();
		const message = errors.map((error: any) => `${error.param}: ${error.msg}`).join(", ");
		return res.status(400).json({ error: message });
	}

	// Handle specific status codes
	switch (err.httpCode) {
		case 400: // Bad Request
			return res.status(400).json({ code: 400, message: err.message || "Bad request" });
		case 401: // Unauthorized
			return res.status(401).json({ code: 401, message: err.message || "Unauthorized" });
		case 403: // Forbidden
			return res.status(403).json({ code: 403, message: err.message || "Forbidden" });
		case 404: // Not Found
			return res.status(404).json({ code: 404, message: err.message || "Resource not found" });
		case 405: // Method Not Allowed
			return res.status(405).json({ code: 405, message: err.message || "Method not allowed" });
		case 408: // Request Timeout
			return res.status(408).json({ code: 408, message: err.message || "Request timeout" });
		case 429: // Too Many Requests
			return res.status(429).json({ code: 429, message: err.message || "Too many requests" });
		case 500: // Internal Server Error
			return res.status(500).json({ code: 500, message: err.message || "Internal server error" });
		default:
			return res.status(500).json({ code: 500, message: "An unexpected error occurred" });
	}
};
