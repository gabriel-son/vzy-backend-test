import { Artifact } from "@components/artifact";
import { authModule } from "@modules/auth/index";

export const localSignup = async (payload: any) => {
	const result = await authModule.localSignup(payload);
	return new Artifact(result.data, result.message, 201);
};

export const localLogin = async (payload: any) => {
	const result = await authModule.localLogin(payload);
	return new Artifact(result.data, result.message, 200);
};
