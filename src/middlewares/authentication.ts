import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "@components/errors";
import { App } from "@config/index";
import { User } from "@models/index";

const verifyJwt = (token: string) => {
	try {
		return jwt.verify(token, App.jwt_secret);
	} catch (error) {
		return error;
	}
};

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.headers.authorization) {
			const parts = (req.headers.authorization as string).split("Bearer");
			if (parts.length !== 2 || parts[0] !== "") {
				throw new UnauthorizedError("Invalid Authorization").setCode("INVALID_AUTHORIZATION");
			}
			const token = parts[1].trim();
			const response: any = verifyJwt(token);
			if (response && response.id) {
				const user = await User.getUser({ _id: response.id, deleted: false });
				if (!user) {
					throw new UnauthorizedError("Authorization failed. User not found");
				} else if (!user.active && user.isEmailVerified) {
					throw new UnauthorizedError("Authorization failed. Account has been deactivated");
				} else if (!user.isEmailVerified) {
					throw new UnauthorizedError("Authorization failed. Please verify your email");
				} else {
					(req as any).user = user;
					next();
				}
			} else {
				if (response.message === "jwt expired") {
					throw new UnauthorizedError("Authorization failed, Access token is expired");
				}
				throw new UnauthorizedError("Invalid authorization token provided");
			}
		} else {
			throw new UnauthorizedError("Unauthorized user: Token not found");
		}
	} catch (error) {
		next(error);
	}
};
