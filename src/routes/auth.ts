import { localSignup, localLogin } from "@controllers/index";
import * as Api from "@components/api";
import { LocalSignup, LocalLogin } from "@middlewares/validators/Auth";

export default Api.load({
	post: [
		["/signup", [], [...LocalSignup], localSignup],
		["/login", [], [...LocalLogin], localLogin],
	],
});
