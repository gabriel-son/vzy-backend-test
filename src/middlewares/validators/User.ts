import { body, param } from "express-validator";
import { User, IUser } from "@models/index";
import { ErrorTypes } from "@components/api";

export const UpdateUser = [
	body("firstName")
		.optional()
		.isString()
		.withMessage(`First name should be a string~${ErrorTypes.INVALID}`)
		.customSanitizer((value: string) => {
			if (value) return value.toLowerCase();
		}),
	body("lastName")
		.optional()
		.isString()
		.withMessage(`Last name should be a string~${ErrorTypes.INVALID}`)
		.customSanitizer((value: string) => {
			if (value) return value.toLowerCase();
		}),
	body("oldPassword")
		.optional()
		.isString()
		.withMessage(`Old password should be a string~${ErrorTypes.INVALID}`)
		.isLength({ min: 6 })
		.withMessage(`Invalid password provided~${ErrorTypes.INVALID}`)
		.custom(async (value: string, { req }) => {
			if (!req.body.password && value) {
				throw new Error(`New password is required when old password is provided~${ErrorTypes.REQUIRED}`);
			}
			const userExist = await User.getUser({ _id: req.params?.id });
			if (!userExist) {
				throw new Error(`User not found~${ErrorTypes.INVALID}`);
			} else if (!(userExist as any).verifyPassword(value)) {
				throw new Error(`Invalid old password provided~${ErrorTypes.INVALID}`);
			} else {
				return value;
			}
		}),
	body("password")
		.optional()
		.isString()
		.withMessage(`New password should be a string~${ErrorTypes.INVALID}`)
		.isLength({ min: 6 })
		.withMessage(`Invalid password provided~${ErrorTypes.INVALID}`)
		.custom(async (value: string, { req }) => {
			if (!req.body.oldPassword && value) {
				throw new Error(`Old password is required when new password is provided~${ErrorTypes.REQUIRED}`);
			}
			const userExist = await User.getUser({ _id: req.params?.id });
			if (userExist && userExist.verifyPassword(value)) {
				throw new Error(`Old password can not be same as new password~${ErrorTypes.INVALID}`);
			} else {
				return value;
			}
		})
		.customSanitizer((value: string) => {
			if (value) return User.encryptPassword(value);
		}),
	param("id")
		.isMongoId()
		.withMessage(`ID should be a valid mongodb ID~${ErrorTypes.INVALID}`)
		.custom(async (value: string) => {
			const userExist = await User.getUser({ _id: value });
			if (!userExist) {
				throw new Error(`User not found~${ErrorTypes.INVALID}`);
			} else {
				return value;
			}
		}),
];
