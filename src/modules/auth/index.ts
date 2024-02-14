import { Logger } from "@components/logger";
import { ServiceUnavailableError, AppError } from "@components/errors";
import { LocalSignupPayload } from "./interface";
import { User } from "@models/index";

class Auth {
	public async localSignup(payload: LocalSignupPayload) {
		try {
			// create the user using the right fields relating to the user
			const newUser = await User.create({
				email: payload.email,
				firstName: payload.firstName,
				lastName: payload.lastName,
				password: payload.password,
				active: true,
				isEmailVerified: true,
			});
			return {
				data: {
					id: newUser._id,
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					email: newUser.email,
				},
				message: "User signup successfully",
			};
		} catch (error) {
			Logger.error("USER-SIGNUP: An error occurred during user signup");
			Logger.error(error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new ServiceUnavailableError("An error occurred while processing your request. Please try again");
		}
	}
}

export const authModule = new Auth();
