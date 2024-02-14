import { Logger } from "@components/logger";
import { ServiceUnavailableError, AppError, BadRequestError } from "@components/errors";
import { IUser, User as UserModel } from "@models/index";
import { UpdateUserPayload } from "./interface";
import _ from "lodash";
class User {
	public async updateUser(payload: UpdateUserPayload) {
		try {
			const selectedUserFields: any = _.pick(payload, ["firstName", "lastName", "password"]);
			if (Object.keys(selectedUserFields).length < 1) {
				throw new BadRequestError("Please provide user data to be updated");
			}
			const userId = payload.id;
			const updatedUser = (await UserModel.findByIdAndUpdate(userId, selectedUserFields, { new: true })) as IUser;
			return {
				data: {
					id: updatedUser._id,
					email: updatedUser.email,
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					isEmailVerified: updatedUser.isEmailVerified,
					role: updatedUser.role,
					active: updatedUser.active,
					profilePicture: updatedUser.profilePicture,
				},
				message: "User profile updated successfully",
			};
		} catch (error) {
			Logger.error("UPDATE-USER-PROFILE: An error occurred during updating user profile");
			Logger.error(error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new ServiceUnavailableError("An error occurred while processing your request. Please try again");
		}
	}
}

export const userModule = new User();
