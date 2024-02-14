import crypto from "crypto";
import jwt from "jsonwebtoken";

export const getRandom = (digits: number) => {
	// tslint:disable-next-line: radix
	return Math.floor(Math.random() * parseInt("8" + "9".repeat(digits - 1)) + parseInt("1" + "0".repeat(digits - 1)));
};

export const generateJWT = (data: { expiresIn: string; secretKey: string; payload: any }) => {
	const { expiresIn, secretKey, payload } = data;

	const accessToken = jwt.sign(payload, secretKey, { expiresIn });
	return accessToken;
};

export const generateUUID = () => {
	return crypto.randomUUID().replace(/-/g, "");
};
