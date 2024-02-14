import { Logger } from "@components/logger";
import { App } from "@config/index";
import { ServiceUnavailableError, AppError } from "@components/errors";
import { LocalSignupPayload, LocalLoginPayload } from "./interface";
import { User, RefreshToken } from "@models/index";
import { generateJWT, generateUUID } from "@utils/index";

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
	public async localLogin(payload: LocalLoginPayload) {
		try {
			console.log("PAYLOAD IS HERE", payload);
			const { email } = payload;
			const user = await User.getUser({ email });
			if (user) {
				let userData: any = {
					id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					isEmailVerified: user.isEmailVerified,
					role: user.role,
					active: user.active,
					profilePicture: user.profilePicture,
				};
				const accessToken = generateJWT({ expiresIn: App.jwt_expiry, secretKey: App.jwt_secret, payload: { id: userData.id } });
				const refreshToken = generateUUID();
				await RefreshToken.create({ user: userData.id, token: refreshToken });
				return {
					data: {
						user: userData,
						accessToken,
						refreshToken: refreshToken,
					},
					message: "User logged in successfully",
				};
			} else {
				throw new ServiceUnavailableError("An error occurred while processing your request. Please try again");
			}
		} catch (error) {
			Logger.error("USER-LOGIN: An error occurred during user login");
			Logger.error(error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new ServiceUnavailableError("An error occurred while processing your request. Please try again");
		}
	}
}

export const authModule = new Auth();
