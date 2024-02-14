import { localSignup } from "@controllers/index";
import * as Api from "@components/api";
import { LocalSignup } from "@middlewares/validators/Auth";

export default Api.load({
	post: [["/signup", [], [...LocalSignup], localSignup]],
});
