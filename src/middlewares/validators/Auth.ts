import { Logger } from "@components/logger";
import { body } from "express-validator";
import { User, IUser } from "@models/index";
import { ErrorTypes } from "@components/api";

export const LocalSignup = [
	body("firstName")
		.notEmpty()
		.withMessage(`First name is required~${ErrorTypes.REQUIRED}`)
		.isString()
		.withMessage(`First name should be a string~${ErrorTypes.INVALID}`)
		.customSanitizer((value: string) => {
			if (value) return value.toLowerCase();
		}),
	body("lastName")
		.notEmpty()
		.withMessage(`Last name is required~${ErrorTypes.REQUIRED}`)
		.isString()
		.withMessage(`Last name should be a string~${ErrorTypes.INVALID}`)
		.customSanitizer((value: string) => {
			if (value) return value.toLowerCase();
		}),
	body("password")
		.notEmpty()
		.withMessage(`Password is required~${ErrorTypes.REQUIRED}`)
		.isString()
		.withMessage(`Password should be a string~${ErrorTypes.INVALID}`)
		.isLength({ min: 6 })
		.withMessage(`Password must have a minimum length of 6 characters~${ErrorTypes.INVALID}`),
	body("email")
		.notEmpty()
		.withMessage(`Email is required~${ErrorTypes.REQUIRED}`)
		.isEmail()
		.withMessage(`Provide a valid email~${ErrorTypes.INVALID}`)
		.custom(async (value: string) => {
			const userExist = await User.getUser({ email: value, deleted: false });
			if (userExist) {
				throw new Error(`User already exist with provided email-${ErrorTypes.DUPLICATE}`);
			} else {
				return value;
			}
		}),
];

export const LocalLogin = [
	body("password")
		.notEmpty()
		.withMessage(`Password is required~${ErrorTypes.REQUIRED}`)
		.isString()
		.withMessage(`Password should be a string~${ErrorTypes.INVALID}`)
		.isLength({ min: 6 })
		.withMessage(`Invalid email or password provided~${ErrorTypes.AUTH}`),
	body("email")
		.notEmpty()
		.withMessage(`Email is required~${ErrorTypes.REQUIRED}`)
		.isEmail()
		.withMessage(`Provide a valid email~${ErrorTypes.INVALID}`)
		.custom(async (value: string, { req }) => {
			const userExist = (await User.getUser({ email: value })) as IUser;
			if (userExist && userExist.deleted) {
				throw new Error(`User not found.~${ErrorTypes.INVALID}`);
			} else if (userExist && !userExist.active) {
				throw new Error(`Account has been suspended. Please contact admin~${ErrorTypes.AUTH}`);
			} else if (!userExist || !userExist.verifyPassword(req.body.password)) {
				Logger.error(`LOGIN:User account not found (${value})`);
				throw new Error(`Invalid email or password provided~${ErrorTypes.AUTH}`);
			} else {
				return value;
			}
		}),
];
