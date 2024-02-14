import { Artifact } from "@components/artifact";
import { userModule } from "@modules/user/index";

export const updateUser = async (payload: any) => {
	const result = await userModule.updateUser(payload);
	return new Artifact(result.data, result.message, 200);
};
